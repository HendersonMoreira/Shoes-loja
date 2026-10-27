import http from 'node:http';
const port = 18788;
let captured = null;
const server = http.createServer((req,res)=>{
  let body=''; req.on('data',c=>body+=c); req.on('end',()=>{
    res.setHeader('content-type','application/json');
    if(req.method==='POST' && req.url==='/checkout/preferences'){
      try { captured=JSON.parse(body); } catch {}
      res.end(JSON.stringify({id:'mock-preference',sandbox_init_point:'http://sandbox.mock.local/checkout/mock-preference'})); return;
    }
    if(req.method==='GET' && req.url==='/v1/payments/12345'){
      res.end(JSON.stringify({id:12345,status:'approved',external_reference:'store-order-mock'})); return;
    }
    if(req.method==='GET' && req.url==='/captured'){
      res.end(JSON.stringify(captured||{})); return;
    }
    res.statusCode=404; res.end(JSON.stringify({error:'not found'}));
  });
});
server.listen(port,'127.0.0.1',()=>console.error('mock-ready'));
