import BrotliDecode from "brotli/decompress";

export const Certification = (certify) => {
  const json = new TextEncoder().encode(certify);
  const buffer = new ArrayBuffer(json.byteLength + 16);
  const view = new DataView(buffer);
  view.setUint32(0, json.byteLength + 16);
  view.setUint16(4, 16);
  view.setUint16(6, 1);
  view.setUint32(8, 7);
  view.setUint32(12, 1);
  for (let r = 0; r < json.byteLength; r++) {
    view.setUint8(16 + r, json[r]);
  }
  return buffer;
};

export const HandleMessage = (blob, resolve) => {
  const Decoder = new TextDecoder();
  const reader = new FileReader();
  reader.addEventListener("load", ({ target }) => {
    const view = new DataView(target.result);
    const result = {
      PacketLength: view.getUint32(0),
      HeadLength: view.getUint16(4),
      PacketVersion: view.getUint16(6),
      Operation: view.getUint32(8),
      Sequence: view.getUint32(12),
      body: [],
    };
    if (result.Operation === 5) {
      const buffer = BrotliDecode(
        new Uint8Array(
          target.result,
          result.HeadLength,
          result.PacketLength - result.HeadLength
        )
      );
      let offset = 0;
      const data = new DataView(buffer.buffer);
      while (offset < buffer.byteLength) {
        const PacketLength = data.getUint32(offset + 0);
        const HeadLength = data.getUint16(offset + 4);
        const text = JSON.parse(
          Decoder.decode(
            new Uint8Array(
              buffer.buffer,
              offset + HeadLength,
              PacketLength - HeadLength
            )
          )
        );
        text.type = /DANMU_MSG/.test(text.cmd) ? "DANMU_MSG" : text.cmd;
        delete text.cmd
        result.body.push(text);
        offset += PacketLength;
      }
    }
    resolve(result.body);
  });
  reader.readAsArrayBuffer(blob);
};

export const Colors = Object.freeze({
  UP: '#FF9800',
  Admin: "#E91E63",
  Translate: "#F44336"
})

export const Ships= Object.freeze({
  "#E17AFF": "https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-2.6f68d77..png",
  "#00D1F1": "https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-3.402ac8f..png",
})