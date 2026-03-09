# TOR Lab Website (GOAT)

TOR Lab Website 是一個前後端分離的實驗室網站專案：

- **前端**：純靜態 HTML/CSS/JS（放在 `frontend/`）
- **後端**：FastAPI（放在 `backend/`）
- **反向代理 / 靜態檔服務**：Caddy（`Caddyfile`）

目前 Caddy 會把：

- `/api/*` 轉發到 FastAPI（`127.0.0.1:8000`）
- 其他路徑當作前端靜態頁面（`./frontend`）

---

## 專案結構

```bash
TOR-Lab-Website/
├─ backend/
│  └─ main.py                  # FastAPI app
├─ frontend/
│  ├─ index.html               # 首頁
│  ├─ about.html               # P.I.
│  ├─ people.html              # 成員
│  ├─ research.html            # 研究主題
│  ├─ publications.html        # 發表
│  ├─ contact.html             # 聯絡
│  ├─ marine-heatwave.html
│  ├─ upper-ocean-thermal-structure.html
│  ├─ static/
│  │  ├─ style.css
│  │  └─ main.js
│  └─ figure/                  # 圖片素材
├─ Caddyfile                   # Caddy 路由設定
└─ caddy_windows_amd64.exe     # Windows Caddy 執行檔
```

---

## API

後端目前提供兩個測試端點：

- `GET /api/health` → `{"ok": true}`
- `GET /api/hello` → `{"msg": "hello from backend"}`

---

## 本機啟動（建議）

> 以下流程適用於 macOS / Linux；Windows 可用同樣概念在 PowerShell 執行。

### 1) 啟動 FastAPI（port 8000）

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2) 另開一個終端，啟動 Caddy（port 8080）

在專案根目錄：

```bash
caddy run --config Caddyfile
```

若你在 Windows 且使用內附執行檔：

```powershell
./caddy_windows_amd64.exe run --config Caddyfile
```

### 3) 開啟網站

- 前端網站：`http://localhost:8080`
- API 健康檢查：`http://localhost:8080/api/health`

---

## 不透過 Caddy 測試前端（可選）

如果你只想快速看靜態頁，也可以直接開一個簡易檔案伺服器：

```bash
cd frontend
python -m http.server 5500
```

再開啟 `http://localhost:5500`。

> 注意：這種方式不會自動代理 `/api/*` 到 FastAPI。

---

## 部署重點

1. 啟動 FastAPI 在內網位址（例如 `127.0.0.1:8000`）。
2. 由 Caddy 對外提供服務（例如 `:8080` 或正式網域 + HTTPS）。
3. 維持 `Caddyfile` 的 `/api/*` 反向代理規則。

---

## 後續可擴充項目

- 補上 `requirements.txt` 或 `pyproject.toml` 固定相依版本。
- 為 FastAPI 加入更多資料 API（新聞、發表、成員）。
- 將前端內容改為模板或 Headless CMS 管理。
- 加入 CI（lint/build/deploy）與基本測試。

---

## 授權

若尚未決定授權方式，建議先新增 `LICENSE`（例如 MIT）以方便對外協作。
