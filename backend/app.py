from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
from db import get_connection, init_db
import time
import secrets
from werkzeug.utils import secure_filename
from flask import flash, redirect, url_for, send_from_directory


app = Flask(__name__)
app.secret_key = "dev-secret-key"
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# 初始化数据库
init_db()


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/product/<int:pid>")
def get_product(pid: int):
    conn = get_connection()
    cur = conn.cursor()

    product = cur.execute("SELECT * FROM products WHERE id = ?", (pid,)).fetchone()

    if not product:
        return jsonify({"error": "Product not found"}), 404

    size_mask = product["size_mask"]

    sizeOptions = []
    # S
    if size_mask & 1:
        sizeOptions.append({"id": 1, "label": "S"})
    # M
    if size_mask & 2:
        sizeOptions.append({"id": 2, "label": "M"})
    # L
    if size_mask & 4:
        sizeOptions.append({"id": 3, "label": "L"})

    conn.close()

    return jsonify(
        {
            "id": product["id"],
            "title": product["title"],
            "description": product["description"],
            "price": product["price"],
            "imageURL": f"http://127.0.0.1:5000/uploads/{product['image_filename']}",
            "sizeOptions": sizeOptions,
        }
    )


@app.post("/product")
def create_product():
    data = request.form

    title = data.get("title")
    description = data.get("description")
    price = data.get("price")
    size_values = request.form.getlist("sizes")  # 例如 ["1", "2", "4"]

    if not title or not price:
        return {"error": "Missing required fields"}, 400

    file = request.files.get("image")
    filename = None

    if file and file.filename:
        if not allowed_file(file.filename):
            return {"error": "Invalid file type. Only png/jpg/jpeg/gif allowed."}, 400

        # 安全化原始文件名（去掉特殊字符/路径）
        original_name = secure_filename(file.filename)

        # 获取扩展名（包含点，比如 .jpg）
        ext = os.path.splitext(original_name)[1].lower()

        # 生成新文件名：时间戳 + 随机字符串 + 扩展名
        timestamp = int(time.time())
        random_str = secrets.token_hex(8)
        filename = f"{timestamp}_{random_str}{ext}"

        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

    size_mask = 0
    for v in size_values:
        try:
            size_mask |= int(v)
        except ValueError:
            pass

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO products (title, description, price, image_filename, size_mask) VALUES (?, ?, ?, ?, ?)",
        (title, description, float(price), filename, size_mask),
    )

    # product_id = cur.lastrowid

    conn.commit()
    conn.close()

    flash("Product created successfully!", "success")
    return redirect(url_for("index"))


@app.route("/")
def index():
    conn = get_connection()
    cur = conn.cursor()

    rows = cur.execute("SELECT * FROM products ORDER BY id DESC").fetchall()
    conn.close()

    products = []
    for p in rows:
        mask = p["size_mask"] or 0

        sizes = []
        if mask & 1:
            sizes.append("S")
        if mask & 2:
            sizes.append("M")
        if mask & 4:
            sizes.append("L")

        products.append(
            {
                "id": p["id"],
                "title": p["title"],
                "description": p["description"],
                "imageurl": (
                    f"/uploads/{p['image_filename']}" if p["image_filename"] else ""
                ),
                "sizes": sizes,  # 传 list 给模板
            }
        )

    return render_template("index.html", products=products)


@app.route("/add")
def add_product_page():
    return render_template("add_product.html")


@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.post("/product/<int:pid>/delete")
def delete_product(pid: int):
    conn = get_connection()
    cur = conn.cursor()

    product = cur.execute(
        "SELECT image_filename FROM products WHERE id = ?", (pid,)
    ).fetchone()

    if not product:
        conn.close()
        flash("Product not found.", "error")
        return redirect(url_for("index"))

    image_filename = product["image_filename"]

    # 再删 product
    cur.execute("DELETE FROM products WHERE id = ?", (pid,))
    conn.commit()
    conn.close()

    # 删图片文件（数据库删完再删文件，避免 DB 回滚导致丢文件）
    if image_filename:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], image_filename)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # 文件删失败不影响主流程，但给个提示
            flash(f"Deleted product, but failed to remove image file: {e}", "error")
            return redirect(url_for("index"))

    flash("Product deleted successfully!", "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
