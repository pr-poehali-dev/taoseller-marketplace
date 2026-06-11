import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime

SCHEMA = "t_p8290427_taoseller_marketplac"


def get_conn():
    dsn = os.environ["DATABASE_URL"]
    if "sslmode" not in dsn:
        dsn += ("&" if "?" in dsn else "?") + "sslmode=disable"
    return psycopg2.connect(dsn)


def handler(event: dict, context) -> dict:
    """Получение и создание заказов TaoSeller."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"""
            SELECT id, order_num, buyer_name, buyer_phone, address, link,
                   quantity, variant, comment, photo, price_yuan, price_rub,
                   total_rub, status, created_at
            FROM {SCHEMA}.orders
            ORDER BY created_at DESC
            LIMIT 100
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        orders = []
        for r in rows:
            orders.append({
                "id": r["id"],
                "order_num": r["order_num"],
                "buyer_name": r["buyer_name"],
                "buyer_phone": r["buyer_phone"],
                "address": r["address"],
                "link": r["link"],
                "quantity": r["quantity"],
                "variant": r["variant"],
                "comment": r["comment"],
                "photo": r["photo"],
                "price_yuan": float(r["price_yuan"]) if r["price_yuan"] else None,
                "price_rub": r["price_rub"],
                "total_rub": r["total_rub"],
                "status": r["status"],
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
            })

        return {"statusCode": 200, "headers": cors, "body": json.dumps({"orders": orders})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        order_num = f"TAO-{datetime.now().strftime('%y%m%d%H%M%S')}"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"""
            INSERT INTO {SCHEMA}.orders
              (order_num, buyer_name, buyer_phone, address, link, quantity,
               variant, comment, photo, price_yuan, price_rub, total_rub, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'new')
            RETURNING id, order_num, created_at
        """, (
            order_num,
            body.get("buyer_name", ""),
            body.get("buyer_phone", ""),
            body.get("address", ""),
            body.get("link", ""),
            int(body.get("quantity", 1)),
            body.get("variant", ""),
            body.get("comment", ""),
            body.get("photo"),
            body.get("price_yuan"),
            body.get("price_rub"),
            body.get("total_rub"),
        ))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 201,
            "headers": cors,
            "body": json.dumps({
                "id": row[0],
                "order_num": row[1],
                "created_at": row[2].isoformat(),
            }),
        }

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}
