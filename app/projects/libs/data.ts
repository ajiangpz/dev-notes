import { sql } from "@vercel/postgres";

// 获取最近的 5 张发票，按日期排序
const data = await sql<LatestInvoiceRaw>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;