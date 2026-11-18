// Set this to the URL of your deployed Cloudflare Worker (see README).
const API_ENDPOINT = "PASTE_YOUR_WORKER_URL_HERE";

const $ = (id) => document.getElementById(id);
const fields = ["traditional", "pinyin", "han_viet", "meaning", "example"];

$("clearBtn").addEventListener("click", () => {
  $("source").value = "";
  $("source").focus();
  $("result").classList.add("hidden");
  $("status").textContent = "";
});

$("translateBtn").addEventListener("click", translate);
$("source").addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") translate();
});

async function translate() {
  const text = $("source").value.trim();
  if (!text) {
    $("status").textContent = "Bạn hãy nhập nội dung cần dịch trước nhé.";
    return;
  }
  if (API_ENDPOINT.includes("PASTE_YOUR_WORKER_URL_HERE")) {
    $("status").textContent = "Ứng dụng chưa được kết nối máy chủ dịch. Hãy làm theo bước cấu hình trong README.";
    return;
  }

  $("translateBtn").disabled = true;
  $("status").textContent = "Đang dịch…";
  $("result").classList.add("hidden");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Không thể dịch lúc này.");
    fields.forEach((key) => $(key).textContent = data[key] || "Chưa có dữ liệu.");
    $("result").classList.remove("hidden");
    $("status").textContent = "Đã dịch xong.";
  } catch (error) {
    $("status").textContent = "Lỗi: " + error.message;
  } finally {
    $("translateBtn").disabled = false;
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    $("status").textContent = "Đã sao chép.";
  } catch {
    $("status").textContent = "Không sao chép được trên trình duyệt này.";
  }
}

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", () => copyText($(button.dataset.copy).textContent));
});
$("copyAllBtn").addEventListener("click", () => {
  const labels = ["繁體中文", "Pinyin", "Âm Hán Việt", "Nghĩa tiếng Việt", "Ví dụ"];
  const values = fields.map(id => $(id).textContent);
  copyText(labels.map((label, i) => label + ":\n" + values[i]).join("\n\n"));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
