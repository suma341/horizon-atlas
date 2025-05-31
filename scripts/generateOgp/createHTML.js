export const createHTML=(coverUrl,iconType,iconUrl,title)=>{
    const file_icon = `https://ryukoku-horizon.github.io/horizon-atlas/pngwing.png`;
    const html = `
      <html>
        <body style="width: 1203px; height: 630px;background: white;">
          ${coverUrl!=="" ? `<img src=${coverUrl} style="position: absolute;top: 0px;left:-10px; width: 101%;height: 330px;object-fit: cover;">` : ""}
          ${coverUrl!=="" ? `<div>
            ${iconType==="" ? `<img src="${file_icon}" style="width: 9rem; height: 9rem;position: absolute; top: 255px; left: 90px" >` : ""}
            ${(iconType !== "emoji" && iconType!=="") ? `<img src=${iconUrl} style="width: 9rem; height: 9rem;position: absolute; top: 255px; left: 90px" >` : ""}
            ${iconType === "emoji" ? `<p style="font-size: 7rem; position: absolute; top: 150px; left: 90px">${iconUrl}</p>` : ""}
            <h2 style="font-size: 64px; font-style: bold;position: absolute; top: 350px; left:40px;">${title}</h2>
          </div>` :
          `<div style="display: flex; align-items: center; justify-content: center; flex:1; grid-gap: 5px;">
            ${iconType==="" ? `<img src="${file_icon}" style="width: 9rem; height: 9rem;" >` : ""}
            ${(iconType !== "emoji" && iconType!=="") ? `<img src=${iconUrl} style="width: 9rem; height: 9rem;" >` : ""}
            ${iconType === "emoji" ? `<p style="font-size: 7.5rem;">${iconUrl}</p>` : ""}
            <h2 style="font-size: 64px; font-style: bold;">${title}</h2>
          </div>`}
        </body>
      </html>
    `;
    return html
}