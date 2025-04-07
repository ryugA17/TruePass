import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia,
  Button,
  IconButton,
  CardActionArea,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

// Featured NFTs data
const featuredNFTs = [
  {
    "title": "Dreamscape",
  "creator": "PixelWizard.eth",
  "platform": "Surreal",
  "price": "0.00420 ETH",
  "description": "A journey into the subconscious through shapes and shades. Vibrant hues meet deep symbolism.",
  "image": "https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/4mhj3z8rY8mx9ttmxbyMHg/eGpRjDZLGoWydWPUpIeOLYiXGyH4BTaH0KUSnKcMTzYxE7x9Zne6O-iQ-xEk711ZsII2SMCjMZcj0K9r0Wx9QCsCejm2zG3o19PPVBBzoMQURSMxMrYj5PMQAV-kytVEGYhO6QRorcw-wyYRpQM77Q/IODStxzZG3iGZj3FbbA50x4Rp0b89dDPTcff3stAgmM",
  "status": "AVAILABLE NOW",
  "mintedCount": "24",
  "maxPerWallet": "5",
    timeLeft: "2d 23h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #00ff9d 0%, #00ff9d40 100%)'
  },
  {
    title: "Digital Renaissance",
    creator: "CryptoMaster.eth",
    platform: "Abstract",
    price: "0.0089 ETH",
    description: "A fusion of classical art and digital innovation, where Renaissance masterpieces meet contemporary digital techniques. Each stroke represents the bridge between centuries of artistic evolution...",
    image: "https://v5.airtableusercontent.com/v3/u/39/39/1744063200000/u3YXNGcQ64Tm5tSavMqo0A/xGs86W3yV6VWwL8sQz_qei-ESVlk8k3iYDe4P-YMV7tJuMg1XJWMNe8dZDWkydFn6B0esv2-VujN-OQJUMoBkWuEQ9DmhS7hUM54v3hL7jXCgtJfmDso-HqjX2EO32ZF0XfZPTj9h6QxAkotpaB10A/38MbdFOx1-eKAiYpzbSr5hAUoeudkwlyjqZjHYlUwQU",
    status: "MINTING NOW",
    mintedCount: "8",
    maxPerWallet: "5",
    timeLeft: "1d 12h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B6B40 100%)'
  },
  {
    title: "Quantum Dreamscape",
    creator: "NeonArtist.eth",
    platform: "Abstract",
    price: "0.0075 ETH",
    description: "Dive into a world where quantum mechanics meets digital art. This piece explores the multiple realities of our existence through vibrant colors and geometric patterns...",
    image: "https://v5.airtableusercontent.com/v3/u/39/39/1744048800000/FPPtNfSsuyDASK99CRDASA/9t8ediv6t1vG1kDg__l72dgxDH73zQPJPqxszvIVvJUy-AVA7TMW1lWnKpw0paW1XU-euSFBHRKw7VRKOkf6Pp94K3z6JejX5rsWo8MjcaVC-UOiATv-Ysgh97-fzBSPhBBeIskpgShdn7s6HOSIcQ/R8P96j-wabHzfHebTely4dBZ-Wvp2_R3W25bCKFvUBI",
    status: "MINTING NOW",
    mintedCount: "15",
    maxPerWallet: "8",
    timeLeft: "3d 8h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #4E65FF 0%, #4E65FF40 100%)'
  }
];

// Mock data for latest drops
const allNFTs = [
  {
    id: 1,
    title: 'Abstract Thought of Art',
    creator: 'ZafGod.eth',
    price: '0.00069 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9iYWZ5YmVpYmtyY3Q2NnZnNWFyc2tpYnR6amxnczUzY28yazNidXBheHdlb2h1YWhnNmwyN3ZyM2g0YQ==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 2,
    title: 'Harvested Opulence',
    creator: 'Fame Identity',
    price: '0.005 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_gif_preview/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVJGVlBxRnVnV0JMWU0xbldXQnhMaW1Gd3dzRHFSTkJVcGQ2Um1XeVNweENYL0dvYXQtZHJvcC0xXzEtZXpnaWYuY29tLW9wdGltaXplLmdpZg==',
    status: '23 hours',
    isVerified: true
  },
  {
    id: 3,
    title: 'RELAX',
    creator: 'brain pasta',
    price: '0.0038 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbWQ3YWNGUVJGSjlSSjduNmZ4dm1WblhhWjlnVDdmYmdoYUVmeHVnSk1NS2NKL0xPTFJBUklCTEUyMDI1SElHSFJFUzMwMDAyLmdpZg==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 4,
    title: 'Spring will come',
    creator: 'Reza Milani',
    price: '0.0004 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbWQyTUYyQkZ4NFl4dTl4dnc3amJRRDRqVm8yNXZCbkdObjZzWWQ2bkFLaWVjL21hdGNoYWluMTItZXpnaWYuY29tLW9wdGltaXplLmdpZg==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 5,
    title: 'Cyber Dreams',
    creator: 'neon.eth',
    price: '0.0089 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9iYWZ5YmVpZnEya3I2aGVocmRjNXFxbXgzNXZ4a29rczNvaWkydHZwcmRhZnl4YWx4bHNxYWtobXp5bQ==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 6,
    title: 'Digital Wilderness',
    creator: 'artmaster',
    price: '0.0123 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVdrY0pnN1FWZTNjWE5TMXROd2s4TmFWaXRCQlRzUGNqdHpLdVYxMnd4Y2V0L3Rob3VnaHRfb2ZfYXJ0LmdpZg==',
    status: '2 hours',
    isVerified: true
  },
  {
    id: 7,
    title: 'Neon Nights',
    creator: 'pixelart.eth',
    price: '0.0075 ETH',
    image: 'https://lh3.googleusercontent.com/RY7_lkqWuNaAXCwks_Xot4D6fueS4s4ubNYt2PzEqEAs1tJFhJLzSVF2PAYtIvNNA4rjoRQhDmGtFeWVZBjcbv70ASTimVVvJ4k=s1000',
    status: 'Now',
    isVerified: true
  },
  {
    id: 8,
    title: 'Future Past',
    creator: 'retro.eth',
    price: '0.0055 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/zkGCYPxUQpuuUoRmF0YnuA/hrykuHNhYmaRONeyyUwEVnjqKO_WbKOzj2qDAriyW0xn-jaos3AD5rV1K_Y6WokGLmXikTL9M_Qd_54Wt1J0Mcz0HF84GPB6FQ0D0FSY7YboM_FK0kg4o8iSntIrvavypHn0vaPjolffYpss0YWPeQ/7qClnynZtSmYX_Sw1ipzQHyshLnLUR7BE0jOBMFRE5k',
    status: '5 hours',
    isVerified: true
  },
  {
    id: 9,
    title: 'Quantum Dreams',
    creator: 'quantum.art',
    price: '0.0095 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744048800000/FPPtNfSsuyDASK99CRDASA/9t8ediv6t1vG1kDg__l72dgxDH73zQPJPqxszvIVvJUy-AVA7TMW1lWnKpw0paW1XU-euSFBHRKw7VRKOkf6Pp94K3z6JejX5rsWo8MjcaVC-UOiATv-Ysgh97-fzBSPhBBeIskpgShdn7s6HOSIcQ/R8P96j-wabHzfHebTely4dBZ-Wvp2_R3W25bCKFvUBI',
    status: 'Now',
    isVerified: true
  },
  {
    id: 10,
    title: 'Virtual Reality',
    creator: 'vr.master',
    price: '0.0082 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVppU3F1Z05UNmsxTUJ3N0pySkpBOHM3b3kxZHhNa3U3eW50U0xGb1VCRktYL0FyYml0cnVtLWxpdmUtb24tUmFyaWJsZS1lemdpZi5jb20tb3B0aW1pemUuZ2lm',
    status: '12 hours',
    isVerified: true
  },
  {
    id: 11,
    title: 'Digital Genesis',
    creator: 'crypto.art',
    price: '0.0067 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_gif_preview/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVl0MlEzOHk3ZWh0c3RUOGNXRWl2enJZdEd6QnBKOWZZZEJoSk1yYUdKV2VKLzEuZ2lm',
    status: 'Now',
    isVerified: true
  },
  {
    id: 12,
    title: 'Pixel Paradise',
    creator: 'pixel.master',
    price: '0.0043 ETH',
    image: 'https://ipfs.raribleuserdata.com/ipfs/bafybeico7a2c5v4tgc4hcj76orsdamo5jeg5uzwrhbclq72yfg4ycw3ta4',
    status: '8 hours',
    isVerified: true
  },{
    id: 13,
    title: 'Spectral Mirage',
    creator: 'VoidCrafter.eth',
    price: '0.0091 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/2dlKSHK4ruwNBxn7lazlDg/kmUipOqfge_6YaJKlX8H4siaCZMgudvZUCjCAFjZm84InzZlsuVoKGKJ2jaaEHOHP2LFarYIjOE7OUXWmhjyN2g0O6oeQrWmXe-Mz8od8Zz1jP44Q3QfucJ9klofPvsFxcPINbdhgsU2Ml2uXGY5Hg/uL6U2p9zgtSYbp0L0oWrb4E8_BX-N9INJAZ6tqdFB-k',
    status: 'Now',
    isVerified: true
  },
  {
    id: 14,
    title: 'Drift Circuit',
    creator: 'HelixDriver',
    price: '0.007 ETH',
    image: 'https://media.tenor.com/TLvHteaTUzwAAAAM/walking-chip-ne555.gif',
    status: '1 hour',
    isVerified: true
  },
  {
    id: 15,
    title: 'Rustcore Bloom',
    creator: 'IronMoth',
    price: '0.0063 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/vv58RzrYXFyRApX6Z3I6nQ/Vyph7jhdeh7B0H7quAf5YSkp36D-LntnzKJtkmnAHTl5r8ZtQkW-88CdqEQHVaKgVCWPyep6QloEA9vp0om-FKqv0cDyZt04ievw2cbbM22KaKEaMtP5QXhCqujnjCTUQRvxsVI6DEKE7R6fM9gC7Q/TmTlaeiOqKCgBd2WC_5Im01AW1X4fI_YDR9aUiyANdI',
    status: 'Now',
    isVerified: false
  },
  {
    id: 16,
    title: 'Liminal Tape',
    creator: 'NoSignal404',
    price: '0.0056 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/HUgEDEeJ0MqLiFg-dCldLg/U-qPSCogtQmrunaIzid483jah_pYQbzKQ9BxmOGs4Xi2g-IjVFUdFtD7U-ArlEVQ_I0lH-39a0D_qBuPAzobRP82UCjmmxy-f7zeff1O6PSuy3PkKxJHLo-QzyG_YOtNbnYxM5IBJ7p1h3IH_tpcJA/fQVKX_-mYAtS9PJ1Ud8hwfOA5UV13lra-KU3QRM7Lcs',
    status: '3 hours',
    isVerified: true
  },
  {
    id: 17,
    title: 'PERFECTL00P: Link Formations',
    creator: 'StudioEcho',
    price: '0.0049 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/A1sxgjoWgOUiIuxcfG75bA/ie0uS0buZmO9xkAfPiD0WvSbiAoV6D_g1gRXfd0N9Seur09V7fLNW-gBHJ9zJ49pVyuEJwCO25-fCwMK_MVjZecBOvmis8C4RMUkEPER7rDOFdaslc9j3ZTEviIccxQNIAbD3eJkscnOPwK0UaP4sQ/9UrqC0FiIL9EM66f_kF1hFzYmuy8YRcR1bC0SHXmSB8',
    status: 'Now',
    isVerified: false
  },
  {
    id: 18,
    title: 'Dreams in Ascii',
    creator: 'bitform',
    price: '0.0034 ETH',
    image: 'https://media.tenor.com/R6SlBBQ1I0YAAAAM/ascii-pepe-ascii.gif',
    status: '2 hours',
    isVerified: true
  },
  {
    id: 19,
    title: 'Shadow Protocol',
    creator: 'EncryptedArtz',
    price: '0.011 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/pJ4i_C2p3dnU5ujTi1HUew/1A-RVAiFLtZ_QCLsNH4rwPCDBFCN2tIgNl-9x-ZRTmZHlQ2xnrDYTcfh8luh_ASjvxB4VMfQJA4q4jqcpX1DbZ05e77_fiMCkFIyV97B0qLqH5ux7ae8vEsnbYd6ihxuB5JMQYhSqQsNMow2PI41GA/1QNH0sVLNgT1u0yFwcNHW8vqR4rQVHUkNi0gVrIVfxc',
    status: 'Now',
    isVerified: true
  },
  {
    id: 20,
    title: 'Skybound Memories',
    creator: 'Loftwave',
    price: '0.006 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/SOrnumWwoSsT9lCYIVFwEQ/RgklAVg6QWl0LBOvxWpZBTRKnh5MgRz2tVgOWU5z9WQRL90TwJtJNTW-_8Z9UyjshY--4WiXlW8kIFLPZAAk5W3nYX57vjQjpWRamONWsf1w1l5G7hLzRkTE6U5KdqmezuQhLc9coTDa2jmsTfTrSg/0d75AuC_XcPWaDQruRvMSYxyZfn9DgvxAst-yaNBzRE',
    status: '4 hours',
    isVerified: true
  },
  {
    id: 21,
    title: 'Neural Meadow',
    creator: 'CoreWeaver',
    price: '0.0099 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/2jQBdUr8V8z0Y4nVlql2SA/CkvM1s6zrKNWengktb3nI7_kz8HhCqHFKWtThLYy0fteRUAjf0oHZcDc8QRBTO55zBxowYKCWhTrCASkJVA-S06oNinlEFZkuwbDugwDr29zH6exblrs4qgjlotTjMVuErCGQ9_Om_Bf2fXVTihSYQ/kar5lyvTF4woY9IbvmmskW0T0M4TqbHVCVTB4AYe-JU',
    status: 'Now',
    isVerified: true
  },
  {
    id: 22,
    title: 'Crystalline Flux',
    creator: 'AltShaper',
    price: '0.0077 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/T60cZiRKm3r9Zgn7QDAetg/a11YQRMP83FYMclE7gNWk-Rr4Q-DG5IcwnEGJ6SrF0QTOxw9V7INtEMkFjnOhYAx7GJbzrk95bp5XPURq2I1miDZJxx526T0bhyN9v8QiArbh7DpjfVOKkHybf27_8ogK8d4Y3zJm_v9FJcapWNn5Q/MgoBZTnMe9Pae-HhuDDR5i0IDK4eh-amJzQyuN-1Q_o',
    status: '6 hours',
    isVerified: false
  },
  {
    id: 23,
    title: 'Tangent Bloom',
    creator: 'DeltaArtist',
    price: '0.0023 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/utMlg9wMCaLfbiw1yPIqgQ/VvcP0Vg7i7iOJn0CN5pnoOxC9ONkmNhAOreq46surHTgz9GS2GcvcvBP_d4odom0KpoU3tF50os--s3-ME_MUpzKYY3IovPuguG0Au7tPln6Ek492iOGR5IOd4Eqif4jIakp2DIW2V1G0H_TQVtFtw/NsVqmS77256bUzasPClM1P3HOVn-ZC3MyGSdaMbNWHY',
    status: 'Now',
    isVerified: true
  },
  {
    id: 24,
    title: 'Dark Code Sonata',
    creator: 'StackTrace.eth',
    price: '0.0101 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_gif_preview/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbWJMalNCUWhIajVONHU0YlBwS2VTMXVkWlNwbkNWTEtaajUzbzdjU0Z6UnI4LzAuZ2lm',
    status: '1 hour',
    isVerified: true
  },
  {
    id: 25,
    title: 'Chrome Embers',
    creator: 'ByteInferno',
    price: '0.005 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/EVz6NGcMuCIWF1pGp46_2Q/xKPr6MYgcg7QjhhKO8IcigT3XdkHCVrgAfpsRW7h6RSoimfbiQaB-jfa4l0uJkK1wlQu3QEG1SKC48dvpYEljPQx7Vouoh9EVpKCeTdA0BaDsSe8cL6kmv9DoYguxRtAbXwAsdKq0vBc8kS4AxW13g/UgE37vC8TH-v-wnN9oZmn-xyEqnj2n5FXRZcdqAKs4g',
    status: 'Now',
    isVerified: true
  },
  {
    id: 26,
    title: 'Long Live NFTs',
    creator: 'SignalJunkie',
    price: '0.0042 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/CykLHu-xCMKDlJ4YbHWf5g/FzAJ8Su5GapPPa4CjDZfyhWnVCv1tIgJYYfvQkyK04c6BWXuyR4YaQfxFBxqdtVa1_ObveVjtXV88u5XTGdgn2SD5i5zk7bKQ9xbF8ENJQjVCW0qcE9BYBsKOQtApiHoMZYKNVhVSdHSlVqRBtZVmg/TFwNlh7BPL65rHmBOrLkmDfhOBd4lZt9OhXLy4ttkoE',
    status: '3 hours',
    isVerified: true
  },
  {
    id: 27,
    title: 'Based Rocket',
    creator: 'NeutrinoDrop',
    price: '0.0088 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/chcoFYuE477wds0W61IRlQ/A8YT_uNrLkvhglZ27o-uDcjwBpbype-Vojf2y-qMSjy9EB5yG4lhn0F9Bc39D6PLRMOElI2vI5tytLXgx0w3WL4UzrhYGUA0wgC_jrDumQgXpisTB53th8J4lP5zl8eXIUbMJ2LDnKbzy7tUz3xeww/vVJp9JYTXXH3HrWDA5iSkqcZJTRhFwn5oiQ7Y578EDA',
    status: 'Now',
    isVerified: false
  },
  {
    id: 28,
    title: 'Solar Syntax',
    creator: 'SunlitHex',
    price: '0.0066 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/HUgEDEeJ0MqLiFg-dCldLg/U-qPSCogtQmrunaIzid483jah_pYQbzKQ9BxmOGs4Xi2g-IjVFUdFtD7U-ArlEVQ_I0lH-39a0D_qBuPAzobRP82UCjmmxy-f7zeff1O6PSuy3PkKxJHLo-QzyG_YOtNbnYxM5IBJ7p1h3IH_tpcJA/fQVKX_-mYAtS9PJ1Ud8hwfOA5UV13lra-KU3QRM7Lcs',
    status: 'Upcoming',
    isVerified: true
  },
  {
    id: 29,
    title: 'The Hellish Swing!',
    creator: 'DeepEchoLab',
    price: '0.0092 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/e6VcTOWYzPEv4g6zHLAaXg/RJmifZFDSfVU6on5x4mIgpnHKn8YxaPAdjehsfzqmEOWJ8_pDlw2Tq3Qh18-CuPpNSwU9NhV1ICTCvLaDrMyd3U4AHdOquZcyJTtA-QKD_NK-Rylvsniap2TrwnrisTUqY16SgY-3iyYE1Kaye3_vg/MKkpnnV6Ml7dzsdBMZGGfQiXo01dZ1cEfRiff2zxVD4',
    status: 'Upcoming',
    isVerified: true
  },
  {
    id: 30,
    title: 'El Capy',
    creator: 'ArtPhantom',
    price: '0.0039 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/BCLijEFcvVxAeXeSAp7O9A/Q3o4JHkb-UjV4gUVa7OWyyj1IUcNOalgVxKqIwmQHGQX71th3EI85oIeRsm8j-ys3RJeY_im6m5FpG55zWIh8L2qZx8aFC9Cql0wv-F719VqvkjwyEODIAYK4_pWgZv_p67hJRLMqOIdX89iQhi7CA/0CFHbcJWPml1O_M5f3SXd_4-PJO2ezlNW9gILJ491R0',
    status: 'Upcoming',
    isVerified: false
  },
  {
    id: 31,
    title: 'Mirrorverse Ritual',
    creator: 'TheOtherPixel',
    price: '0.0115 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/pJ4i_C2p3dnU5ujTi1HUew/1A-RVAiFLtZ_QCLsNH4rwPCDBFCN2tIgNl-9x-ZRTmZHlQ2xnrDYTcfh8luh_ASjvxB4VMfQJA4q4jqcpX1DbZ05e77_fiMCkFIyV97B0qLqH5ux7ae8vEsnbYd6ihxuB5JMQYhSqQsNMow2PI41GA/1QNH0sVLNgT1u0yFwcNHW8vqR4rQVHUkNi0gVrIVfxc',
    status: 'Upcoming',
    isVerified: true
  },
  {
    id: 32,
    title: 'HYPE Fight Club',
    creator: 'FluxGarden',
    price: '0.006 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/mVMud87ha8IiRBl2ckT6wA/56R9Zd3gqPNPW8mBdEDAFdjZ7cmapiFiH22c1IoBLo0Ni1fial84nmSTKzCQGOzPFO7dWjRMwXC7viM5eW5PupnowLVCzqlW176k_03han14UQzzYMrMG-3gTXztTu9R_Q3ZgSW8Qzhw5M0d6dIvKw/hD32qqpDS9-YxUdPA03pJ9EnnILTPY2DK104c2-Z9NM',
    status: 'Upcoming',
    isVerified: true
  }
];

const ITEMS_PER_PAGE = 5;

// Additional NFT collections
const trendingNFTs = allNFTs.filter(nft => nft.id >= 13 && nft.id <= 20).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 1.5).toFixed(4) + ' ETH', // Higher prices for trending
  status: Math.random() > 0.5 ? 'Trending' : 'Hot'
}));

const popularNFTs = allNFTs.filter(nft => nft.id >= 21 && nft.id <= 27).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 2).toFixed(4) + ' ETH', // Higher prices for popular
  status: Math.random() > 0.5 ? 'Popular' : 'Featured'
}));

const upcomingNFTs = allNFTs.filter(nft => nft.id >= 28 && nft.id <= 32).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 0.8).toFixed(4) + ' ETH', // Lower prices for upcoming
  status: Math.random() > 0.5 ? '1d left' : '2d left'
}));

// Fixed card dimensions for consistency
const CARD_WIDTH = 400;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = 340;
const INFO_HEIGHT = 60;

// Fixed dimensions for featured section
const FEATURED_HEIGHT = 400;
const FEATURED_WIDTH = 1150; // Double the card width since it's a featured item

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm } = useSearch();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const { addToCart } = useCart();
  
  // States for each section
  const [hoveredNFTId, setHoveredNFTId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [trendingStep, setTrendingStep] = useState(0);
  const [popularStep, setPopularStep] = useState(0);
  const [upcomingStep, setUpcomingStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTrendingAnimating, setIsTrendingAnimating] = useState(false);
  const [isPopularAnimating, setIsPopularAnimating] = useState(false);
  const [isUpcomingAnimating, setIsUpcomingAnimating] = useState(false);
  const [activeFeaturedStep, setActiveFeaturedStep] = useState(0);
  const [isFeaturedAnimating, setIsFeaturedAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [mintQuantity, setMintQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const maxSteps = allNFTs.length;
  const maxFeaturedSteps = featuredNFTs.length;

  // Reset pagination when search query changes
  useEffect(() => {
    setActiveStep(0);
    setTrendingStep(0);
    setPopularStep(0);
    setUpcomingStep(0);
  }, [searchQuery]);

  // Filter NFTs based on search term
  const filterNFTs = (nfts: typeof allNFTs) => {
    const searchLower = searchQuery.toLowerCase();
    return nfts.filter((nft) => (
      nft.title.toLowerCase().includes(searchLower) ||
      nft.creator.toLowerCase().includes(searchLower) ||
      nft.price.toLowerCase().includes(searchLower)
    ));
  };

  const filteredNFTs = filterNFTs(allNFTs);
  const filteredTrendingNFTs = filterNFTs(trendingNFTs);
  const filteredPopularNFTs = filterNFTs(popularNFTs);
  const filteredUpcomingNFTs = filterNFTs(upcomingNFTs);

  // Navigation handlers for each section - updated for one-at-a-time navigation
  const createHandlers = (
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setAnimating: React.Dispatch<React.SetStateAction<boolean>>,
    maxSteps: number
  ) => ({
    handleNext: () => {
      if (!setAnimating || currentStep >= maxSteps - 1) return;
      setAnimating(true);
      setStep((prev) => prev + 1); // Move one item at a time
      setTimeout(() => setAnimating(false), 500);
    },
    handleBack: () => {
      if (!setAnimating || currentStep <= 0) return;
      setAnimating(true);
      setStep((prev) => prev - 1); // Move one item at a time
      setTimeout(() => setAnimating(false), 500);
    }
  });

  const handleFeaturedNext = () => {
    if (isFeaturedAnimating || activeFeaturedStep >= maxFeaturedSteps - 1) return;
    setIsFeaturedAnimating(true);
    setActiveFeaturedStep((prevStep) => prevStep + 1);
    setTimeout(() => setIsFeaturedAnimating(false), 500);
  };

  const handleFeaturedBack = () => {
    if (isFeaturedAnimating || activeFeaturedStep <= 0) return;
    setIsFeaturedAnimating(true);
    setActiveFeaturedStep((prevStep) => prevStep - 1);
    setTimeout(() => setIsFeaturedAnimating(false), 500);
  };

  // Calculate which NFTs to show with one item sliding
  const visibleNFTs = allNFTs.slice(
    Math.max(0, activeStep - 2),
    Math.min(activeStep + 3, allNFTs.length)
  );

  // Create NFT Grid Section component
  const NFTGridSection = ({ 
    title, 
    nfts, 
    step, 
    isAnimating, 
    onNext, 
    onBack,
    sectionKey 
  }: { 
    title: string;
    nfts: typeof allNFTs;
    step: number;
    isAnimating: boolean;
    onNext: () => void;
    onBack: () => void;
    sectionKey: string;
  }) => {
    
    // If there are no NFTs, don't render the section
    if (nfts.length === 0) {
      return null;
    }
    
    const handleAddToCart = (nft: any) => {
      addToCart({
        id: nft.id,
        title: nft.title,
        creator: nft.creator,
        price: typeof nft.price === 'string' && nft.price.includes(' ') 
          ? nft.price.split(' ')[0] 
          : nft.price,
        image: nft.image
      });
      setShowAddedToCart(true);
    };
    
    return (
      <>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          mt: 8
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          height: `${CARD_HEIGHT}px`, // Fixed height for the container
        }}>
          <IconButton
            onClick={onBack}
            disabled={step === 0 || isAnimating}
            sx={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              zIndex: 2,
              width: 48,
              height: 48,
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255,255,255,0.4)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
                display: 'flex'
              }
            }}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>

          <IconButton
            onClick={onNext}
            disabled={step >= nfts.length - 1 || isAnimating}
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              zIndex: 2,
              width: 48,
              height: 48,
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255,255,255,0.4)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
                display: 'flex'
              }
            }}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${step * (100 / ITEMS_PER_PAGE)}%)`,
              ml: 0,
              height: '100%',
            }}
          >
            {nfts.map((nft) => {
              const uniqueId = `${sectionKey}-${nft.id}`;
              
              return (
                <Box
                  key={nft.id}
                  sx={{
                    flex: `0 0 ${100 / ITEMS_PER_PAGE}%`,
                    padding: '0 8px',
                    transition: 'all 0.5s ease-in-out',
                    opacity: 1,
                    transform: 'scale(1)',
                    height: `${CARD_HEIGHT}px`,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(22, 28, 36, 0.95)',
                      borderRadius: 2,
                      position: 'relative',
                      height: `${CARD_HEIGHT}px`,
                      width: `${CARD_WIDTH}px`,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                    onMouseEnter={() => setHoveredNFTId(uniqueId)}
                    onMouseLeave={() => setHoveredNFTId(null)}
                  >
                    <CardActionArea 
                      sx={{ 
                        height: '100%', 
                        width: '100%',
                        position: 'relative',
                        display: 'block'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${IMAGE_HEIGHT}px`,
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={nft.image}
                          alt={nft.title}
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      </Box>
                      
                      {hoveredNFTId === uniqueId && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: `${IMAGE_HEIGHT}px`,
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(nft);
                            }}
                            sx={{
                              bgcolor: 'white',
                              color: 'black',
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'white',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 20px rgba(255,255,255,0.25)'
                              },
                              borderRadius: '20px',
                              padding: '8px 16px',
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      )}
                    </CardActionArea>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        p: 1,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        height: `${INFO_HEIGHT}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" component="div" noWrap sx={{ color: 'white' }}>
                          {nft.title}
                        </Typography>
                        {nft.isVerified && (
                          <VerifiedIcon color="primary" sx={{ fontSize: 18, ml: 0.5 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {nft.creator}
                        </Typography>
                        <Typography variant="caption" color="primary" noWrap>
                          {nft.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      </>
    );
  };

  const latestHandlers = createHandlers(activeStep, setActiveStep, setIsAnimating, filteredNFTs.length);
  const trendingHandlers = createHandlers(trendingStep, setTrendingStep, setIsTrendingAnimating, filteredTrendingNFTs.length);
  const popularHandlers = createHandlers(popularStep, setPopularStep, setIsPopularAnimating, filteredPopularNFTs.length);
  const upcomingHandlers = createHandlers(upcomingStep, setUpcomingStep, setIsUpcomingAnimating, filteredUpcomingNFTs.length);

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 8 }}>
      {/* Featured NFT Section with video background */}
      <Box 
        sx={{ 
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          py: 4,
          mb: 4,
          overflow: 'hidden',
        }}
      >
        {/* Video Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(5, 14, 66, 0.3)', // Reduced opacity to let the video show through better
              zIndex: 1
            }
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
          >
            <source src="./videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <Container 
          maxWidth="xl" 
          sx={{ 
            position: 'relative',
            zIndex: 1 // Ensure content appears above the video
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            overflow: 'hidden', 
            height: `${FEATURED_HEIGHT}px`,
          }}>
            <IconButton
              onClick={handleFeaturedBack}
              disabled={activeFeaturedStep === 0 || isFeaturedAnimating}
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                zIndex: 2,
                width: 48,
                height: 48,
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255,255,255,0.4)',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                  display: 'flex'
                }
              }}
            >
              <KeyboardArrowLeft fontSize="large" />
            </IconButton>

            <IconButton
              onClick={handleFeaturedNext}
              disabled={activeFeaturedStep >= maxFeaturedSteps - 1 || isFeaturedAnimating}
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                zIndex: 2,
                width: 48,
                height: 48,
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255,255,255,0.4)',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                  display: 'flex'
                }
              }}
            >
              <KeyboardArrowRight fontSize="large" />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(-${activeFeaturedStep * 100}%)`,
                height: '100%',
              }}
            >
              {featuredNFTs.map((nft, index) => (
                <Box
                  key={index}
                  sx={{ 
                    flex: '0 0 100%',
                    transition: 'all 0.5s ease-in-out',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: nft.gradient,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      width: `${FEATURED_WIDTH}px`,
                      height: '100%',
                    }}
                  >
                    <Grid container spacing={0} sx={{ height: '100%' }}>
                      <Grid item xs={12} md={6} sx={{ 
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            color: nft.gradient.includes('#00ff9d') ? '#00ff9d' : 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            mb: 1,
                            display: 'inline-block'
                          }}
                        >
                          {nft.status}
                        </Typography>
                        
                        <Typography variant="h4" component="h1" sx={{ mt: 1, mb: 1, fontWeight: 'bold', color: '#000' }}>
                          {nft.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ color: '#000' }}>by</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>{nft.creator}</Typography>
                            {nft.isVerified && <VerifiedIcon sx={{ fontSize: 16, color: '#2196f3' }} />}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#000' }}>on</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>{nft.platform}</Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2, color: '#000', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {nft.description}
                        </Typography>

                        <Box sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          mb: 2
                        }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                                {nft.price}
                              </Typography>
                              
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: '#000',
                                  color: '#fff',
                                  px: 3,
                                  py: 1,
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: index + 100,
                                    title: nft.title,
                                    creator: nft.creator,
                                    price: nft.price.split(' ')[0],
                                    image: nft.image
                                  });
                                  setShowAddedToCart(true);
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Box>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={3} sx={{ color: '#000', mt: 'auto' }}>
                          <Box>
                            <Typography variant="caption">Minted</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.mintedCount} minted</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">Per wallet</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.maxPerWallet} per wallet</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">Time left</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.timeLeft} left</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                          }}
                          onMouseEnter={() => setHoveredNFTId(`featured-${index}`)}
                          onMouseLeave={() => setHoveredNFTId(null)}
                        >
                          <img 
                            src={nft.image} 
                            alt={nft.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          
                          {hoveredNFTId === `featured-${index}` && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'all 0.3s ease-in-out'
                              }}
                            >
                              <Button 
                                variant="contained" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: index + 100,
                                    title: nft.title,
                                    creator: nft.creator,
                                    price: nft.price.split(' ')[0],
                                    image: nft.image
                                  });
                                  setShowAddedToCart(true);
                                }}
                                sx={{ 
                                  bgcolor: 'white',
                                  color: 'black',
                                  '&:hover': {
                                    bgcolor: 'white',
                                  },
                                  borderRadius: '20px',
                                  px: 3
                                }}
                              >
                                Quick Add
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Latest NFTs Section */}
      <NFTGridSection
        title="Latest Drops"
        nfts={filteredNFTs}
        step={activeStep}
        isAnimating={isAnimating}
        onNext={latestHandlers.handleNext}
        onBack={latestHandlers.handleBack}
        sectionKey="latest"
      />
      
      <NFTGridSection
        title="Trending NFTs"
        nfts={filteredTrendingNFTs}
        step={trendingStep}
        isAnimating={isTrendingAnimating}
        onNext={trendingHandlers.handleNext}
        onBack={trendingHandlers.handleBack}
        sectionKey="trending"
      />
      
      <NFTGridSection
        title="Popular Collections"
        nfts={filteredPopularNFTs}
        step={popularStep}
        isAnimating={isPopularAnimating}
        onNext={popularHandlers.handleNext}
        onBack={popularHandlers.handleBack}
        sectionKey="popular"
      />
      
      <NFTGridSection
        title="Upcoming Drops"
        nfts={filteredUpcomingNFTs}
        step={upcomingStep}
        isAnimating={isUpcomingAnimating}
        onNext={upcomingHandlers.handleNext}
        onBack={upcomingHandlers.handleBack}
        sectionKey="upcoming"
      />
      
      <Snackbar
        open={showAddedToCart}
        autoHideDuration={3000}
        onClose={() => setShowAddedToCart(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setShowAddedToCart(false)} 
          severity="success" 
          sx={{ width: '100%' }} 
          variant="filled"
        >
          NFT added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home; 