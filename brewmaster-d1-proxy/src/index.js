/**
 * Cloudflare D1 Database Proxy Worker
 * Secure middleman between POS/Menu apps and D1 SQLite.
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Only POST method is allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    try {
      const body = await request.json();
      
      // 1. Batch mode
      if (body.batch && Array.isArray(body.batch)) {
        const statements = body.batch.map(item => {
          return env.DB.prepare(item.sql).bind(...(item.params || []));
        });
        const batchResult = await env.DB.batch(statements);
        return new Response(JSON.stringify({ success: true, result: batchResult }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      
      // 2. Single query mode
      if (body.sql) {
        const result = await env.DB.prepare(body.sql).bind(...(body.params || [])).all();
        return new Response(JSON.stringify({ success: true, result: [result] }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ success: false, error: "Invalid payload. Expected 'sql' or 'batch'." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
