"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const palette = ["#0E6F73", "#B7791F", "#C2413B", "#4B5563", "#6A8D73", "#34515E"];

export function SimpleBarChart({ data, height = 250 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#E6EBEF" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #D7DEE5", boxShadow: "0 8px 24px rgba(23, 32, 38, 0.12)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={palette[index % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimplePieChart({ data, height = 250 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={82} label>
            {data.map((_, index) => (
              <Cell key={index} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #D7DEE5", boxShadow: "0 8px 24px rgba(23, 32, 38, 0.12)" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
