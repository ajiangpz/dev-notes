export default async function Page() {
  const data = await fetch(
    "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=&secret="
  );
  const token = await data.json();
  console.log(token.access_token);
  try {
    const wifi = await fetch(
      `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${token.access_token}&env=&name=`,
      {
        method: "POST",
        body: JSON.stringify({
          type: "addWiFi",
          params: {}
        })
      }
    );
    console.log(await wifi.json());
  } catch (err) {
    console.log(err);
  }
}
