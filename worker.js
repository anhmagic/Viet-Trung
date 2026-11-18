// Cloudflare Worker: keep your OpenAI API key in a Worker secret named OPENAI_API_KEY.
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, {headers: cors});
    if (request.method !== "POST") return json({error: "Use POST."}, 405, cors);
    if (!env.OPENAI_API_KEY) return json({error: "Máy chủ chưa cấu hình API key."}, 500, cors);

    try {
      const body = await request.json();
      const input = String(body.text || "").trim();
      if (!input) return json({error: "Vui lòng nhập nội dung."}, 400, cors);
      if (input.length > 5000) return json({error: "Mỗi lần dịch tối đa 5.000 ký tự."}, 400, cors);

      const ai = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: `Bạn là trợ lý dịch thuật Việt-Trung. Dịch đầu vào tiếng Việt sang tiếng Trung phồn thể theo cách dùng tự nhiên tại Đài Loan. Trả về CHỈ một JSON object hợp lệ, không markdown, với đúng 5 trường string:
traditional: bản dịch chữ Hán phồn thể;
pinyin: pinyin có dấu thanh;
han_viet: âm Hán Việt tương ứng với chữ Hán, nếu không tự nhiên hoặc không chắc thì ghi chú ngắn;
meaning: giải thích nghĩa tiếng Việt, nêu sắc thái/cách dùng nếu hữu ích;
example: một câu ví dụ tiếng Trung phồn thể và bản dịch tiếng Việt.
Không tự ý thêm thông tin không có trong câu gốc. Nếu đầu vào là từ/cụm từ, dịch sát nghĩa và giải thích cách dùng.`,
          input,
          text: {format: {type: "json_object"}}
        })
      });
      const result = await ai.json();
      if (!ai.ok) return json({error: result.error?.message || "Lỗi từ dịch vụ AI."}, ai.status, cors);

      const outputText = (result.output || [])
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("");
      const parsed = JSON.parse(outputText);
      return json(parsed, 200, cors);
    } catch (error) {
      return json({error: "Không xử lý được yêu cầu: " + error.message}, 500, cors);
    }
  }
};

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {...cors, "Content-Type": "application/json; charset=utf-8"}
  });
}
