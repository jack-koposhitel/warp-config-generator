import nacl from "tweetnacl"
import { Buffer } from "buffer"

// Import IP ranges
import {
  DISCORD_IPS,
  YOUTUBE_IPS,
  X_TWITTER_IPS,
  FACEBOOK_INSTAGRAM_IPS,
  VIBER_IPS,
  ZETFLIX_IPS,
  NNMCLUB_IPS,
  RUTRACKER_IPS,
  KINOZAL_IPS,
  COPILOT_IPS,
  CANVA_IPS,
  PATREON_IPS,
  ANIMEGO_IPS,
  JUTSU_IPS,
  YUMMYANIME_IPS,
  PORNHUB_IPS,
  XVIDEOS_IPS,
  PORNOLAB_IPS,
  FICBOOK_IPS,
  PROTON_IPS
} from "./ipRanges"

// Простая генерация QR кода через внешний сервис
async function generateQRCode(text: string) {
  /*
  try {
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WarpGenerator/1.0)'
      }
    })
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64 = btoa(binary)
      return `data:image/png;base64,${base64}`
    }
  } catch (error) {
    console.log("QR generation via API failed:", error.message)
  }
  */
  
  // Fallback SVG QR code placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" style="border: 1px solid #ccc;">
    <rect width="200" height="200" fill="white"/>
    <!-- Sad face outline -->
    <circle cx="100" cy="100" r="70" fill="none" stroke="black" stroke-width="2"/>
    <!-- Left eye -->
    <circle cx="80" cy="85" r="5" fill="none" stroke="black" stroke-width="2"/>
    <!-- Right eye -->
    <circle cx="120" cy="85" r="5" fill="none" stroke="black" stroke-width="2"/>
    <!-- Sad mouth -->
    <path d="M 75 125 Q 100 110 125 125" fill="none" stroke="black" stroke-width="2"/>
    <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">QR код недоступен</text>
  </svg>`;

  return svgToDataUrl(svg);
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateKeys() {
  const keyPair = nacl.box.keyPair()
  return {
    privKey: Buffer.from(keyPair.secretKey).toString("base64"),
    pubKey: Buffer.from(keyPair.publicKey).toString("base64"),
  }
}

async function apiRequest(method: string, endpoint: string, body: any = null, token: string | null = null) {
  const headers: HeadersInit = {
    "User-Agent": "",
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`https://api.cloudflareclient.com/v0i1909051800/${endpoint}`, options)
  return response.json()
}

async function generateWarpConfig(
  selectedServices: string[],
  siteMode: "all" | "specific",
  deviceType: "computer" | "phone",
) {
  const { privKey, pubKey } = generateKeys()

  const regBody = {
    install_id: "",
    tos: new Date().toISOString(),
    key: pubKey,
    fcm_token: "",
    type: "ios",
    locale: "en_US",
  }
  const regResponse = await apiRequest("POST", "reg", regBody)

  const id = regResponse.result.id
  const token = regResponse.result.token

  const warpResponse = await apiRequest("PATCH", `reg/${id}`, { warp_enabled: true }, token)

  const peer_pub = warpResponse.result.config.peers[0].public_key
  const peer_endpoint = warpResponse.result.config.peers[0].endpoint.host
  const client_ipv4 = warpResponse.result.config.interface.addresses.v4
  const client_ipv6 = warpResponse.result.config.interface.addresses.v6

  let allowed_ips_set = new Set<string>()

  if (siteMode === "specific") {
    const ipRanges: { [key: string]: string } = {
      discord: DISCORD_IPS,
      youtube: YOUTUBE_IPS,
      twitter: X_TWITTER_IPS,
      instagram: FACEBOOK_INSTAGRAM_IPS,
      facebook: FACEBOOK_INSTAGRAM_IPS,
      viber: VIBER_IPS,
      zetflix: ZETFLIX_IPS,
      nnmclub: NNMCLUB_IPS,
      rutracker: RUTRACKER_IPS,
      kinozal: KINOZAL_IPS,
      copilot: COPILOT_IPS,
      canva: CANVA_IPS,
      patreon: PATREON_IPS,
      animego: ANIMEGO_IPS,
      jutsu: JUTSU_IPS,
      yummyanime: YUMMYANIME_IPS,
      pornhub: PORNHUB_IPS,
      xvideos: XVIDEOS_IPS,
      pornolab: PORNOLAB_IPS,
      ficbook: FICBOOK_IPS,
      proton: PROTON_IPS,
    }

    selectedServices.forEach((service) => {
      if (ipRanges[service]) {
        allowed_ips_set = new Set([...allowed_ips_set, ...ipRanges[service].split(", ")])
      }
    })
  }

  const allowed_ips = siteMode === "all" ? "0.0.0.0/0, ::/0" : Array.from(allowed_ips_set).join(", ")

  const platform_params = deviceType === "computer" ? "Jc = 4\nJmin = 40\nJmax = 70" : "Jc = 120\nJmin = 23\nJmax = 911"

  const conf = `[Interface]
PrivateKey = ${privKey}
Jc = 8
Jmin = 50
Jmax = 1000
I1 = <b 0xc70000000108ce1bf31eec7d93360000449e227e4596ed7f75c4d35ce31880b4133107c822c6355b51f0d7c1bba96d5c210a48aca01885fed0871cfc37d59137d73b506dc013bb4a13c060ca5b04b7ae215af71e37d6e8ff1db235f9fe0c25cb8b492471054a7c8d0d6077d430d07f6e87a8699287f6e69f54263c7334a8e144a29851429bf2e350e519445172d36953e96085110ce1fb641e5efad42c0feb4711ece959b72cc4d6f3c1e83251adb572b921534f6ac4b10927167f41fe50040a75acef62f45bded67c0b45b9d655ce374589cad6f568b8475b2e8921ff98628f86ff2eb5bcce6f3ddb7dc89e37c5b5e78ddc8d93a58896e530b5f9f1448ab3b7a1d1f24a63bf981634f6183a21af310ffa52e9ddf5521561760288669de01a5f2f1a4f922e68d0592026bbe4329b654d4f5d6ace4f6a23b8560b720a5350691c0037b10acfac9726add44e7d3e880ee6f3b0d6429ff33655c297fee786bb5ac032e48d2062cd45e305e6d8d8b82bfbf0fdbc5ec09943d1ad02b0b5868ac4b24bb10255196be883562c35a713002014016b8cc5224768b3d330016cf8ed9300fe6bf39b4b19b3667cddc6e7c7ebe4437a58862606a2a66bd4184b09ab9d2cd3d3faed4d2ab71dd821422a9540c4c5fa2a9b2e6693d411a22854a8e541ed930796521f03a54254074bc4c5bca152a1723260e7d70a24d49720acc544b41359cfc252385bda7de7d05878ac0ea0343c77715e145160e6562161dfe2024846dfda3ce99068817a2418e66e4f37dea40a21251c8a034f83145071d93baadf050ca0f95dc9ce2338fb082d64fbc8faba905cec66e65c0e1f9b003c32c943381282d4ab09bef9b6813ff3ff5118623d2617867e25f0601df583c3ac51bc6303f79e68d8f8de4b8363ec9c7728b3ec5fcd5274edfca2a42f2727aa223c557afb33f5bea4f64aeb252c0150ed734d4d8eccb257824e8e090f65029a3a042a51e5cc8767408ae07d55da8507e4d009ae72c47ddb138df3cab6cc023df2532f88fb5a4c4bd917fafde0f3134be09231c389c70bc55cb95a779615e8e0a76a2b4d943aabfde0e394c985c0cb0376930f92c5b6998ef49ff4a13652b787503f55c4e3d8eebd6e1bc6db3a6d405d8405bd7a8db7cefc64d16e0d105a468f3d33d29e5744a24c4ac43ce0eb1bf6b559aed520b91108cda2de6e2c4f14bc4f4dc58712580e07d217c8cca1aaf7ac04bab3e7b1008b966f1ed4fba3fd93a0a9d3a27127e7aa587fbcc60d548300146bdc126982a58ff5342fc41a43f83a3d2722a26645bc961894e339b953e78ab395ff2fb854247ad06d446cc2944a1aefb90573115dc198f5c1efbc22bc6d7a74e41e666a643d5f85f57fde81b87ceff95353d22ae8bab11684180dd142642894d8dc34e402f802c2fd4a73508ca99124e428d67437c871dd96e506ffc39c0fc401f666b437adca41fd563cbcfd0fa22fbbf8112979c4e677fb533d981745cceed0fe96da6cc0593c430bbb71bcbf924f70b4547b0bb4d41c94a09a9ef1147935a5c75bb2f721fbd24ea6a9f5c9331187490ffa6d4e34e6bb30c2c54a0344724f01088fb2751a486f425362741664efb287bce66c4a544c96fa8b124d3c6b9eaca170c0b530799a6e878a57f402eb0016cf2689d55c76b2a91285e2273763f3afc5bc9398273f5338a06d>
S1 = 0
S2 = 0
H1 = 1
H2 = 2
H3 = 3
H4 = 4
MTU = 1280
Address = ${client_ipv4}, ${client_ipv6}
DNS = 1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001

[Peer]
PublicKey = ${peer_pub}
AllowedIPs = ${allowed_ips}
Endpoint = engage.cloudflareclient.com:2408`

  return conf
}

// 188.114.99.224:1002 engage.cloudflareclient.com:500 ${peer_endpoint}

function removeMtuLine(config: string) {
  return config.replace(/^MTU = 1280\n?/gm, "")
}

export async function getWarpConfigLink(
  selectedServices: string[],
  siteMode: "all" | "specific",
  deviceType: "computer" | "phone",
) {
  try {
    const conf = await generateWarpConfig(selectedServices, siteMode, deviceType)
    const confBase64 = Buffer.from(conf).toString("base64")
    const confWithoutMtu = removeMtuLine(conf)
    const qrCodeBase64 = await generateQRCode(confWithoutMtu)
    return {
      configBase64: confBase64,
      qrCodeBase64: qrCodeBase64,
    }
  } catch (error) {
    console.error("Ошибка при генерации конфига:", error)
    return null
  }
}

