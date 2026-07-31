import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { customers, currentPlans, demoScenario, features, proposedPlans } from "../lib/demo/data";
import { defaultRiskWeights } from "../lib/simulation/risk-settings";

process.env.DATABASE_URL ??= "postgresql://planshift:planshift@localhost:5432/planshift?schema=public";

const prisma = new PrismaClient();

async function main() {
  await prisma.report.deleteMany();
  await prisma.strategyComparison.deleteMany();
  await prisma.customerImpact.deleteMany();
  await prisma.simulationResult.deleteMany();
  await prisma.simulationScenario.deleteMany();
  await prisma.importError.deleteMany();
  await prisma.importBatch.deleteMany();
  await prisma.featureUsage.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.planFeature.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.riskWeightSetting.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: "PlanShift Demo Workspace",
      riskWeights: { create: defaultRiskWeights }
    }
  });

  const passwordHash = await bcrypt.hash("PlanShift123!", 12);
  const [admin, pm] = await Promise.all([
    prisma.user.create({ data: { name: "Admin Demo", email: "admin@planshift.dev", passwordHash, role: "ADMIN", organizationId: organization.id } }),
    prisma.user.create({ data: { name: "Product Manager Demo", email: "pm@planshift.dev", passwordHash, role: "PRODUCT_MANAGER", organizationId: organization.id } })
  ]);

  const featureByKey = new Map<string, string>();
  for (const feature of features) {
    const created = await prisma.feature.create({
      data: {
        organizationId: organization.id,
        key: feature.key,
        name: feature.name,
        description: feature.description,
        category: feature.category,
        isBusinessCritical: feature.isBusinessCritical
      }
    });
    featureByKey.set(feature.key, created.id);
  }

  const planByName = new Map<string, string>();
  for (const plan of [...currentPlans, ...proposedPlans]) {
    const created = await prisma.plan.create({
      data: {
        organizationId: organization.id,
        planType: plan.planType,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        usageLimits: plan.usageLimits,
        supportLevel: plan.supportLevel,
        features: {
          create: plan.featureKeys
            .map((key) => featureByKey.get(key))
            .filter(Boolean)
            .map((featureId) => ({ featureId: featureId! }))
        }
      }
    });
    planByName.set(`${plan.planType}:${plan.name}`, created.id);
  }

  const customerIdByDemoId = new Map<string, string>();
  for (const customer of customers) {
    const created = await prisma.customer.create({
      data: {
        organizationId: organization.id,
        externalCustomerId: customer.externalCustomerId,
        companyName: customer.companyName,
        segment: customer.segment,
        region: customer.region,
        currentPlanId: planByName.get(`CURRENT:${customer.currentPlanName}`),
        mrr: customer.mrr,
        arr: customer.arr,
        renewalDate: new Date(customer.renewalDate),
        contractType: customer.contractType,
        customerSuccessOwner: customer.customerSuccessOwner,
        healthScore: customer.healthScore,
        supportTicketCountLast90Days: customer.supportTicketCountLast90Days,
        contract: customer.contract
          ? {
              create: {
                renewalDate: new Date(customer.contract.renewalDate),
                contractEndDate: new Date(customer.contract.contractEndDate),
                discountPercentage: customer.contract.discountPercentage,
                customTerms: customer.contract.customTerms,
                canChangePriceBeforeRenewal: customer.contract.canChangePriceBeforeRenewal
              }
            }
          : undefined
      }
    });
    customerIdByDemoId.set(customer.id, created.id);
  }

  const usageRows = customers.flatMap((customer) =>
    customer.featureUsage.map((usage) => ({
      customerId: customerIdByDemoId.get(customer.id)!,
      featureId: featureByKey.get(usage.featureKey)!,
      usageCountLast30Days: usage.usageCountLast30Days,
      usageCountLast90Days: usage.usageCountLast90Days,
      isBusinessCritical: usage.isBusinessCritical
    }))
  );
  await prisma.featureUsage.createMany({ data: usageRows.slice(0, 2000), skipDuplicates: true });

  await prisma.simulationScenario.create({
    data: {
      organizationId: organization.id,
      name: demoScenario.name,
      description: demoScenario.description,
      pricingChangeType: demoScenario.pricingChangeType,
      affectedPlanIds: [planByName.get("CURRENT:Pro")!],
      proposedPlanIds: [planByName.get("PROPOSED:Business")!, planByName.get("PROPOSED:Enterprise")!],
      affectedFeatureIds: [featureByKey.get("sso")!, featureByKey.get("advanced_audit_logs")!],
      migrationStartDate: new Date(demoScenario.migrationStartDate),
      migrationEndDate: new Date(demoScenario.migrationEndDate),
      grandfatheringRule: demoScenario.grandfatheringRule,
      revenueAssumption: demoScenario.revenueAssumption,
      churnRiskAssumption: demoScenario.churnRiskAssumption,
      discountStrategy: demoScenario.discountStrategy,
      notes: demoScenario.notes,
      status: "DRAFT",
      createdById: pm.id
    }
  });

  console.log(`Seeded ${organization.name}`);
  console.log("Demo users:");
  console.log("  admin@planshift.dev / PlanShift123!");
  console.log("  pm@planshift.dev / PlanShift123!");
  console.log(`Synthetic customers: ${customers.length}`);
  console.log(`Feature usage rows: ${usageRows.slice(0, 2000).length}`);
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
