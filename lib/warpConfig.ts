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
I1 = <b 0xc10000000114367096bb0fb3f58f3a3fb8aaacd61d63a1c8a40e14f7374b8a62dccba6431716c3abf6f5afbcfb39bd008000047c32e268567c652e6f4db58bff759bc8c5aaca183b87cb4d22938fe7d8dca22a679a79e4d9ee62e4bbb3a380dd78d4e8e48f26b38a1d42d76b371a5a9a0444827a69d1ab5872a85749f65a4104e931740b4dc1e2dd77733fc7fac4f93011cd622f2bb47e85f71992e2d585f8dc765a7a12ddeb879746a267393ad023d267c4bd79f258703e27345155268bd3cc0506ebd72e2e3c6b5b0f005299cd94b67ddabe30389c4f9b5c2d512dcc298c14f14e9b7f931e1dc397926c31fbb7cebfc668349c218672501031ecce151d4cb03c4c660b6c6fe7754e75446cd7de09a8c81030c5f6fb377203f551864f3d83e27de7b86499736cbbb549b2f37f436db1cae0a4ea39930f0534aacdd1e3534bc87877e2afabe959ced261f228d6362e6fd277c88c312d966c8b9f67e4a92e757773db0b0862fb8108d1d8fa262a40a1b4171961f0704c8ba314da2482ac8ed9bd28d4b50f7432d89fd800c25a50c5e2f5c0710544fef5273401116aa0572366d8e49ad758fcb29e6a92912e644dbe227c247cb3417eabfab2db16796b2fba420de3b1dc94e8361f1f324a331ddaf1e626553138860757fd0bf687566108b77b70fb9f8f8962eca599c4a70ed373666961a8cb506b96756d9e28b94122b20f16b54f118c0e603ce0b831efea614ad836df6cf9affbdd09596412547496967da758cec9080295d853b0861670b71d9abde0d562b1a6de82782a5b0c14d297f27283a895abc889a5f6703f0e6eb95f67b2da45f150d0d8ab805612d570c2d5cb6997ac3a7756226c2f5c8982ffbd480c5004b0660a3c9468945efde90864019a2b519458724b55d766e16b0da25c0557c01f3c11ddeb024b62e303640e17fdd57dedb3aeb4a2c1b7c93059f9c1d7118d77caac1cd0f6556e46cbc991c1bb16970273dea833d01e5090d061a0c6d25af2415cd2878af97f6d0e7f1f936247b394ecb9bd484da6be936dee9b0b92dc90101a1b4295e97a9772f2263eb09431995aa173df4ca2abd687d87706f0f93eaa5e13cbe3b574fa3cfe94502ace25265778da6960d561381769c24e0cbd7aac73c16f95ae74ff7ec38124f7c722b9cb151d4b6841343f29be8f35145e1b27021056820fed77003df8554b4155716c8cf6049ef5e318481460a8ce3be7c7bfac695255be84dc491c19e9dedc449dd3471728cd2a3ee51324ccb3eef121e3e08f8e18f0006ea8957371d9f2f739f0b89e4db11e5c6430ada61572e589519fbad4498b460ce6e4407fc2d8f2dd4293a50a0cb8fcaaf35cd9a8cc097e3603fbfa08d9036f52b3e7fcce11b83ad28a4ac12dba0395a0cc871cefd1a2856fffb3f28d82ce35cf80579974778bab13d9b3578d8c75a2d196087a2cd439aff2bb33f2db24ac175fff4ed91d36a4cdbfaf3f83074f03894ea40f17034629890da3efdbb41141b38368ab532209b69f057ddc559c19bc8ae62bf3fd564c9a35d9a83d14a95834a92bae6d9a29ae5e8ece07910d16433e4c6230c9bd7d68b47de0de9843988af6dc88b5301820443bd4d0537778bf6b4c1dd067fcf14b81015f2a67c7f2a28f9cb7e0684d3cb4b1c24d9b343122a086611b489532f1c3a26779da1706c6759d96d8ab>
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

