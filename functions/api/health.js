const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

export function onRequest() {
  return new Response(JSON.stringify({ ok: true, service: 'mission-control', phase: '3-lite' }), {
    status: 200,
    headers
  });
}
