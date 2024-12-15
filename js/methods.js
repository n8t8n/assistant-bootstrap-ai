let LOCAL_CDN_URL=""+window.location.origin,bootstrapMethods={hasBootstrapCode(e){var o=["container","row","col","btn","card","navbar","modal","alert","form","input","select","textarea","table","list-group","badge","breadcrumb","pagination","progress","spinner","toast","collapse","dropdown","offcanvas","carousel","accordion"];if(e.toLowerCase().includes("bootstrap")){var r=e.match(/```html([\s\S]*?)```/);if(r){let t=r[1].toLowerCase();if(o.some(e=>t.includes(e)))return!0}r=e.match(/<pre><code class="language-html">([\s\S]*?)<\/code><\/pre>/);if(r){let t=r[1].toLowerCase();if(o.some(e=>t.includes(e)))return!0}}return!1},extractBootstrapCode(e){e=e.match(/```html([\s\S]*?)```/);return e?e[1].trim():""},formatMessage(e,t){try{var o,r=this.chatLog[t];return r&&"user"===r.role?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").split("\n").join("<br>"):(o=marked.parse(e),DOMPurify.sanitize(o,{ADD_ATTR:["class"],ADD_TAGS:["pre","code"]}))}catch(e){return console.error("Error formatting message:",e),"Error rendering message."}},togglePreview(e){var e=this.chatLog[e];e&&"assistant"===e.role&&(e=e.content,e=this.extractBootstrapCode(e))&&(e=`
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bootstrap Preview code</title>
        <link rel="stylesheet" href="${LOCAL_CDN_URL}/node_modules/bootstrap/dist/css/bootstrap.css">
        <link rel="stylesheet" href="${LOCAL_CDN_URL}/node_modules/bootstrap-icons/font/bootstrap-icons.css">
      </head>
      ${e}
      <script src="${LOCAL_CDN_URL}/node_modules/bootstrap/dist/js/bootstrap.bundle.js"></script>
    `,e=new Blob([e],{type:"text/html"}),e=URL.createObjectURL(e),window.open(e,"_blank"))}};export{bootstrapMethods};