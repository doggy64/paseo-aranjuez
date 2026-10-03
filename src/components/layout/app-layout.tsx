"use client";

import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/providers/store-provider";
import {
  useEffect,
  useRef,
  useState,
  createElement,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  CreditCard,
  Gift,
  Heart,
  House,
  LayoutDashboard,
  Leaf,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Package,
  Plus,
  QrCode,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Ticket,
  Trophy,
  Users,
  Utensils,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import QRCode from "qrcode";

function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return createElement(
    "button",
    { type: "button", ...props, className: `button ${className}` },
    children,
  );
}
function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return createElement("input", props);
}
function Heading({
  children,
  level = 2,
  className = "",
}: {
  children: ReactNode;
  level?: number;
  className?: string;
}) {
  return createElement(`h${level}`, { className }, children);
}
function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

type Page =
  | "Inicio"
  | "Explorar el Paseo"
  | "PaseoYa"
  | "Paseo Points"
  | "Jarvis Paseo"
  | "Eventos y experiencias"
  | "Mi actividad"
  | "Comercio"
  | "Administración";

type Shop = {
  id: string;
  name: string;
  category: string;
  floor: string;
  image: string;
  rating: string;
  description: string;
};
type Product = {
  id: string;
  name: string;
  shop: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};
type Order = {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  state: number;
  pin: string;
  slot: string;
  date: string;
  payment: string;
};
type Movement = { id: string; title: string; points: number; date: string };

const shops: Shop[] = [
  {
    id: "cayenna",
    name: "Cayenna Bistro Café",
    category: "Gastronomía",
    floor: "Cuarto piso",
    image: "/assets/cayenna.jpeg",
    rating: "4.9",
    description:
      "Una pausa deliciosa. Café, platos de autor y buenos momentos en la terraza gourmet.",
  },
  {
    id: "puma",
    name: "PUMA",
    category: "Moda",
    floor: "Planta baja",
    image: "/assets/puma.JPG",
    rating: "4.8",
    description:
      "Encuentra tu siguiente movimiento con moda deportiva, calzado y accesorios.",
  },
  {
    id: "flowers",
    name: "Flor de Amor",
    category: "Regalos",
    floor: "Planta baja",
    image: "/assets/floristeria-flor-de-amor.webp",
    rating: "4.9",
    description:
      "Flores y detalles para convertir cualquier día en una ocasión especial.",
  },
  {
    id: "apple",
    name: "Apple Land",
    category: "Tecnología",
    floor: "Segundo piso",
    image: "/assets/apple-land.webp",
    rating: "4.8",
    description:
      "Tecnología y accesorios para estar conectado con lo que más te importa.",
  },
  {
    id: "cinnabon",
    name: "Cinnabon",
    category: "Gastronomía",
    floor: "Planta baja",
    image: "/assets/cinnabon.JPG",
    rating: "4.7",
    description:
      "Rollos de canela recién horneados y pequeños momentos de felicidad.",
  },
  {
    id: "totto",
    name: "Totto",
    category: "Moda",
    floor: "Segundo piso",
    image: "/assets/totto.webp",
    rating: "4.8",
    description:
      "Mochilas y accesorios para acompañarte en todas tus aventuras.",
  },
  {
    id: "burger",
    name: "Bypass Burger",
    category: "Gastronomía",
    floor: "Tercer piso",
    image: "/assets/bypass-burger.webp",
    rating: "4.7",
    description: "Hamburguesas y sabor en el mercado gastronómico.",
  },
  {
    id: "games",
    name: "Game Shop",
    category: "Entretenimiento",
    floor: "Segundo piso",
    image: "/assets/game-shop.webp",
    rating: "4.8",
    description: "Juegos y accesorios para tu próxima aventura.",
  },
];

const initialProducts: Product[] = [
  {
    id: "coffee",
    name: "Cappuccino + brownie",
    shop: "cayenna",
    price: 45,
    stock: 20,
    category: "Gastronomía",
    image: "/assets/cayenna.jpeg",
  },
  {
    id: "shoes",
    name: "Zapatillas urbanas PUMA",
    shop: "puma",
    price: 590,
    stock: 8,
    category: "Moda",
    image: "/assets/puma.JPG",
  },
  {
    id: "flowers",
    name: "Ramo de flores de temporada",
    shop: "flowers",
    price: 150,
    stock: 12,
    category: "Regalos",
    image: "/assets/floristeria-flor-de-amor.webp",
  },
  {
    id: "headphones",
    name: "Audífonos Bluetooth",
    shop: "apple",
    price: 250,
    stock: 15,
    category: "Tecnología",
    image: "/assets/apple-land.webp",
  },
  {
    id: "roll",
    name: "Classic cinnamon roll",
    shop: "cinnabon",
    price: 30,
    stock: 24,
    category: "Gastronomía",
    image: "/assets/cinnabon.JPG",
  },
  {
    id: "bag",
    name: "Mochila para todos los días",
    shop: "totto",
    price: 290,
    stock: 6,
    category: "Moda",
    image: "/assets/totto.webp",
  },
  {
    id: "burger",
    name: "Combo burger + papas",
    shop: "burger",
    price: 55,
    stock: 18,
    category: "Gastronomía",
    image: "/assets/bypass-burger.webp",
  },
  {
    id: "game",
    name: "Control inalámbrico",
    shop: "games",
    price: 320,
    stock: 4,
    category: "Entretenimiento",
    image: "/assets/game-shop.webp",
  },
];

const categories = [
  { name: "Todos", icon: Store },
  { name: "Gastronomía", icon: Utensils },
  { name: "Moda", icon: ShoppingBag },
  { name: "Tecnología", icon: Zap },
  { name: "Regalos", icon: Gift },
  { name: "Entretenimiento", icon: Ticket },
  { name: "Oficinas y servicios", icon: BriefcaseBusiness },
];

const events = [
  {
    id: "music",
    title: "Atardeceres con música en vivo",
    type: "Música & gastronomía",
    date: "24 ABR",
    time: "Viernes · 19:00",
    place: "Terraza gourmet · Cuarto piso",
    image: "/assets/cayenna.jpeg",
    icon: Utensils,
  },
  {
    id: "art",
    title: "Un encuentro con el arte",
    type: "Arte & cultura",
    date: "25 ABR",
    time: "Sábado · 15:00",
    place: "Espacio cultural",
    image: "/assets/paseo-exterior.jpg",
    icon: Sparkles,
  },
  {
    id: "kids",
    title: "Pequeños, grandes aventureros",
    type: "Diversión en familia",
    date: "26 ABR",
    time: "Domingo · 15:00",
    place: "Sky Games · Tercer y cuarto piso",
    image: "/assets/game-shop.webp",
    icon: Ticket,
  },
];

const rewards = [
  {
    id: "cafe",
    title: "Tu próxima pausa, por nuestra cuenta",
    shop: "Cayenna Bistro Café",
    cost: 300,
    icon: Coffee,
    description: "Un café de cortesía para disfrutar en el Paseo.",
  },
  {
    id: "discount",
    title: "Un detalle para ti",
    shop: "Tiendas participantes",
    cost: 500,
    icon: Gift,
    description: "Cupón de Bs 50 en compras superiores a Bs 250.",
  },
  {
    id: "vip",
    title: "Una experiencia diferente",
    shop: "Terraza gourmet",
    cost: 1000,
    icon: Star,
    description: "Acceso a una degustación especial para una persona.",
  },
];

const nav = [
  { name: "Inicio", icon: House },
  { name: "Explorar el Paseo", icon: Map },
  { name: "PaseoYa", icon: ShoppingBag },
  { name: "Paseo Points", icon: Gift },
  { name: "Jarvis Paseo", icon: Sparkles },
  { name: "Eventos y experiencias", icon: CalendarDays },
  { name: "Mi actividad", icon: Clock3 },
] as const;

const orderStates = [
  "Pedido recibido",
  "Pedido confirmado",
  "Preparando pedido",
  "Listo para recoger",
  "Cliente llegó al Paseo",
  "Pedido entregado",
];

const money = (n: number) => `Bs ${n.toLocaleString("es-BO")}`;
const dateNow = () => new Date().toLocaleDateString("es-BO");
const uid = () => crypto.randomUUID();

function QR({ value }: { value: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(value, { width: 200, margin: 2 }).then(setSrc);
  }, [value]);
  return src ? (
    <img className="qr-image" src={src} alt="Código QR de demostración" />
  ) : (
    <QrCode size={100} />
  );
}

function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const targets = ref.current?.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, [href], [tabindex="0"]',
        );
        if (!targets?.length) return;
        const first = targets[0],
          last = targets[targets.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [close]);
  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        ref={ref}
        tabIndex={-1}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <Heading>{title}</Heading>
          <Button className="icon-button" aria-label="Cerrar" onClick={close}>
            <X size={20} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
    

  const {
    favorites, setFavorites,
    cart, setCart,
    points, setPoints,
    products, setProducts,
    orders, setOrders,
    movements, setMovements,
    coupons, setCoupons,
    reservations, setReservations,
    profile, setProfile,
    modal, setModal, selectedShop, setSelectedShop,
    equivalence, addMovement
  } = useStore();          const [extraShops, setExtraShops] = useSaved<Shop[]>(
    "paseo-extra-shops-v1",
    [],
  );
  const [promos, setPromos] = useSaved<string[]>("paseo-promos-v1", [
    "Puntos dobles en gastronomía · viernes",
    "10% de descuento en accesorios seleccionados",
  ]);
  const [messages, setMessages] = useSaved<{ role: string; text: string }[]>(
    "paseo-chat-v1",
    [],
  );
  const [chatInput, setChatInput] = useState("");
  const [chatLanguage, setChatLanguage] = useState("Español");
  const [slot, setSlot] = useState("Hoy · 17:00 a 18:00");
  const [payment, setPayment] = useState("Pago al retirar");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [floor, setFloor] = useState("Todos los pisos");
  const [merchantShop, setMerchantShop] = useState("cayenna");
  const [validation, setValidation] = useState("");  const [activityTab, setActivityTab] = useState("Pedidos");
  const [notificationsRead, setNotificationsRead] = useSaved(
    "paseo-read-v1",
    false,
  );

  
const navMap: Record<string, string> = {
  "Inicio": "/",
  "Explorar el Paseo": "/explorar",
  "PaseoYa": "/paseoya",
  "Paseo Points": "/puntos",
  "Jarvis Paseo": "/jarvis",
  "Eventos y experiencias": "/eventos",
  "Mi actividad": "/actividad",
};

  const allShops = [...shops, ...extraShops];
  const shopOf = (id: string) => allShops.find((s) => s.id === id) || shops[0];
  const notify = (message: string) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  
  const router = useRouter();
  const go = (path: string) => {
    setMobileMenu(false);
    router.push(path);
  };

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );

  const addCart = (p: Product) => {
    if ((cart[p.id] || 0) >= p.stock)
      return notify("Has alcanzado el stock disponible.");
    setCart((prev) => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
    notify(`${p.name} añadido al carrito`);
  };

  const cartItems = products
    .filter((p) => cart[p.id] > 0)
    .map((product) => ({ product, quantity: cart[product.id] }));
  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);
  const total = cartItems.reduce(
    (a, b) => a + b.product.price * b.quantity,
    0,
  );

  
  const checkout = () => {
    if (!cartItems.length) return;
    if (cartItems.some((i) => i.quantity > i.product.stock))
      return notify("Revisa el stock disponible antes de confirmar.");
    const order: Order = {
      id: `PA-${Date.now().toString().slice(-6)}`,
      items: cartItems,
      total,
      state: 0,
      pin: String(Math.floor(100000 + Math.random() * 900000)),
      slot,
      date: dateNow(),
      payment,
    };
    setOrders((prev) => [order, ...prev]);
    setProducts((prev) =>
      prev.map((p) => ({ ...p, stock: p.stock - (cart[p.id] || 0) })),
    );
    addMovement(`Compra ${order.id}`, Math.floor(total * equivalence));
    setCart({});
    setModal(null);
    go("Mi actividad");
    notify("Pedido de demostración creado. ¡Tus puntos ya están en tu cuenta!");
  };

  const redeem = (reward: (typeof rewards)[number]) => {
    if (points < reward.cost)
      return notify("Todavía no tienes suficientes puntos para este beneficio.");
    addMovement(`Canje: ${reward.shop}`, -reward.cost);
    setCoupons((prev) => [
      {
        id: uid(),
        title: reward.title,
        code: `PASEO-${Math.floor(100000 + Math.random() * 900000)}`,
        used: false,
      },
      ...prev,
    ]);
    notify("Beneficio canjeado. Encuentra tu código en Mi actividad.");
  };

  const query = search.toLocaleLowerCase();
  const filteredShops = allShops.filter(
    (s) =>
      (category === "Todos" || s.category === category) &&
      `${s.name} ${s.category} ${s.description}`
        .toLowerCase()
        .includes(query) &&
      (!onlyFavorites || favorites.includes(s.id)) &&
      (floor === "Todos los pisos" || s.floor === floor),
  );
  const filteredProducts = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      `${p.name} ${shopOf(p.shop).name} ${p.category}`
        .toLowerCase()
        .includes(query) &&
      (!onlyFavorites || favorites.includes(p.id)),
  );

  const askJarvis = (question: string) => {
    if (!question.trim()) return;
    const q = question.toLowerCase();
    let answer =
      "Puedo ayudarte a descubrir tiendas, productos, promociones, oficinas, eventos y ubicaciones. Prueba con «busco un regalo», «quiero un café» o «¿cómo funcionan mis puntos?». Trabajo con el catálogo de demostración de este prototipo, no con una IA conectada.";
    if (/regalo|pareja|gift/.test(q))
      answer =
        "Un detalle siempre es una buena idea. Te recomiendo el ramo de Flor de Amor por Bs 150 en planta baja, o una mochila de Totto por Bs 290 en el segundo piso. Puedes reservarlos en PaseoYa, recogerlos personalmente y sumar puntos.";
    else if (/comer|hambre|café|cafe|coffee|food/.test(q))
      answer =
        "Para una pausa, Cayenna Bistro Café está en el cuarto piso: nuestro combo de ejemplo cappuccino + brownie cuesta Bs 45. Para algo rápido, Bypass Burger está en el tercero. Puedes pedir desde PaseoYa y retirar en el comercio. Horarios y disponibilidad deben confirmarse con cada local.";
    else if (/punto|point|beneficio|promoc/.test(q))
      answer = `Tienes ${points.toLocaleString("es-BO")} Paseo Points. Cada Bs 1 de compra genera ${equivalence} punto(s) en esta demo. Un café cuesta 300 puntos y el cupón de Bs 50 cuesta 500. Visita Paseo Points para canjear. Promociones de ejemplo: ${promos.join("; ")}.`;
    else if (/evento|hoy|music|arte/.test(q))
      answer = `En nuestra agenda de demostración: ${events.map((e) => `${e.title}, ${e.date}, ${e.time}, ${e.place}`).join("; ")}. Puedes guardar tu lugar en Eventos y experiencias. Estas fechas no constituyen una agenda oficial.`;
    else if (/oficina|cowork|reuni|office/.test(q))
      answer =
        "Las torres empresariales cuentan con oficinas tipo A, B, C y D. El cowork ofrece proyector, vista panorámica y alquiler por hora, día o mes. En Explorar el Paseo → Oficinas y servicios puedes solicitar una reserva de demostración; la disponibilidad real debe confirmarse con administración.";
    else if (/estacion|parking/.test(q))
      answer =
        "Para información actualizada sobre accesos y estacionamiento, consulta con Paseo Aranjuez al (+591) 61795513. Nuestro mapa es un esquema de navegación de demostración, no un plano oficial.";
    else if (/pedido|retiro|order/.test(q))
      answer = orders.length
        ? `Tu último pedido ${orders[0].id} está en estado «${orderStates[orders[0].state]}». Retiro: ${orders[0].slot}. Presenta el PIN en cada comercio correspondiente. Consulta el detalle en Mi actividad.`
        : "Todavía no tienes pedidos. Compra en PaseoYa, elige tu horario y retira personalmente en el Paseo con tu código. No ofrecemos delivery en este prototipo.";
    else {
      const match = allShops.find((s) =>
        q.includes(s.name.toLowerCase().split(" ")[0]),
      );
      if (match)
        answer = `${match.name} se encuentra en ${match.floor}. ${match.description} Encuentra su catálogo en PaseoYa y su ubicación en Explorar el Paseo. Los horarios deben confirmarse con el establecimiento.`;
    }
    if (chatLanguage === "English")
      answer = /gift|regalo/.test(q)
        ? "Try a seasonal bouquet at Flor de Amor (ground floor, Bs 150), or a Totto backpack (second floor, Bs 290). Order on PaseoYa, collect in person and earn points. All prices and availability are demo data."
        : `Welcome! Explore shops, food, offices and experiences at Paseo Aranjuez. You have ${points} points. All orders require in-person pickup. This is a demo assistant, not a connected AI. For live information call (+591) 61795513.`;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);
    setChatInput("");
  };

  const sectionHead = (title: string, eyebrow: string, subtitle: string) => (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <Heading level={1}>{title}</Heading>
      <p>{subtitle}</p>
    </div>
  );

  const categoryBar = () => (
    <div className="category-tabs">
      {categories.map((c) => (
        <Button
          key={c.name}
          className={`category-tab ${category === c.name ? "selected" : ""}`}
          onClick={() => setCategory(c.name)}
        >
          <c.icon size={17} />
          {c.name}
        </Button>
      ))}
    </div>
  );

  const shopCard = (s: Shop) => (
    <div className="shop-card" key={s.id}>
      <div className="shop-photo">
        <img src={s.image} alt={s.name} />
        <span className="photo-badge">
          <span className="green-dot" />
          En el Paseo
        </span>
        <Button
          className={`favorite icon-button ${
            favorites.includes(s.id) ? "is-favorite" : ""
          }`}
          aria-label={`Guardar ${s.name}`}
          onClick={() => toggleFavorite(s.id)}
        >
          <Heart
            size={18}
            fill={favorites.includes(s.id) ? "currentColor" : "none"}
          />
        </Button>
      </div>
      <div className="shop-info">
        <div className="shop-category">
          {s.category}
          <span>
            <Star size={12} fill="currentColor" />
            {s.rating}
          </span>
        </div>
        <Heading level={3}>{s.name}</Heading>
        <p>
          <MapPin size={13} />
          {s.floor}
        </p>
        <div className="shop-bottom">
          <span>
            <Gift size={13} />
            Acumula Paseo Points
          </span>
          <Button
            className="small-link"
            onClick={() => {
              setSelectedShop(s);
              setModal("shop");
            }}
            aria-label={`Ver ${s.name}`}
          >
            <ArrowUpRight size={19} />
          </Button>
        </div>
      </div>
    </div>
  );

  const productCard = (p: Product) => (
    <div className="shop-card product-card" key={p.id}>
      <div className="shop-photo">
        <img src={p.image} alt={`Comercio ${shopOf(p.shop).name}`} />
        <span className="photo-badge">
          {p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}
        </span>
        <Button
          className={`favorite icon-button ${
            favorites.includes(p.id) ? "is-favorite" : ""
          }`}
          aria-label={`Guardar ${p.name}`}
          onClick={() => toggleFavorite(p.id)}
        >
          <Heart
            size={17}
            fill={favorites.includes(p.id) ? "currentColor" : "none"}
          />
        </Button>
      </div>
      <div className="shop-info">
        <span className="muted small">
          {shopOf(p.shop).name} · {shopOf(p.shop).floor}
        </span>
        <Heading level={3}>{p.name}</Heading>
        <div className="product-price">
          <strong>{money(p.price)}</strong>
          <span>+{Math.floor(p.price * equivalence)} puntos</span>
        </div>
        <Button
          className="primary full"
          disabled={p.stock <= 0}
          onClick={() => addCart(p)}
        >
          <Plus size={16} />
          Añadir al carrito
        </Button>
      </div>
    </div>
  );

  const pointsCard = (large = false) => (
    <div className={`points-card ${large ? "large" : ""}`}>
      <div className="points-card-top">
        <span className="points-brand">
          <Sparkles size={16} />
          PASEO POINTS
        </span>
        <span className="gold-badge">
          <Trophy size={12} />
          Nivel Oro
        </span>
      </div>
      <p>Disfrutar tiene su recompensa</p>
      <div className="points-number">
        {points.toLocaleString("es-BO")}
        <span>puntos disponibles</span>
      </div>
      <div className="level-track">
        <div style={{ width: `${Math.min(100, points / 20)}%` }} />
      </div>
      <div className="points-caption">
        <span>{Math.max(0, 2000 - points)} puntos para Platinum</span>
        <span>2.000 pts</span>
      </div>
      <div className="points-actions">
        <Button onClick={() => go("Paseo Points")}>
          Ver beneficios
          <ArrowRight size={15} />
        </Button>
        <Button
          className="qr-button"
          aria-label="Mostrar mi QR"
          onClick={() => setModal("qr")}
        >
          <QrCode size={20} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      {mobileMenu && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <Button
          className="brand"
          onClick={() => go("/")}
          aria-label="Paseo Aranjuez, inicio"
        >
          <img src="/assets/paseo-logo.png" alt="Paseo Aranjuez" />
          <span>UN LUGAR. MIL EXPERIENCIAS.</span>
        </Button>
        <div className="nav-label">TU PASEO, CONECTADO</div>
        <nav>
          {nav.map((n) => (
            <Button
              key={n.name}
              className={`nav-item ${usePathname() === navMap[n.name] ? "active" : ""}`}
              onClick={() => go(navMap[n.name])}
            >
              <n.icon size={19} />
              <span>{n.name}</span>
              {n.name === "Jarvis Paseo" && (
                <span className="ai-label">IA</span>
              )}
              {n.name === "PaseoYa" && <span className="new-dot" />}
            </Button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-jarvis">
            <span className="jarvis-mini">
              <Sparkles size={20} />
            </span>
            <strong>¿Qué hacemos hoy?</strong>
            <p>
              Jarvis te ayuda a encontrar
              <br />
              tu próximo plan.
            </p>
            <Button onClick={() => go("/jarvis")}>
              Hablar con Jarvis
              <ArrowUpRight size={15} />
            </Button>
          </div>
          <div className="role-nav">
            <Button
              className={usePathname() === "/comercio" ? "selected" : ""}
              onClick={() => go("/comercio")}
            >
              <Store size={16} />
              Portal de comercios
              <ArrowUpRight size={13} />
            </Button>
            <Button
              className={usePathname() === "/admin" ? "selected" : ""}
              onClick={() => go("/admin")}
            >
              <ShieldCheck size={16} />
              Administración
              <ArrowUpRight size={13} />
            </Button>
          </div>
          <Button
            className="sidebar-profile"
            onClick={() => setModal("profile")}
          >
            <span className="avatar">{profile.name.charAt(0)}</span>
            <span>
              <strong>{profile.name}</strong>
              <small>Mi cuenta · Demo</small>
            </span>
            <ChevronDown size={15} />
          </Button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <Button
              className="mobile-toggle icon-button"
              aria-label="Abrir menú"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </Button>
            <span>Mi Paseo</span>
            <ChevronRight size={13} />
            <strong>{Object.keys(navMap).find(k => navMap[k] === usePathname()) || "Administración"}</strong>
          </div>
          <div className="top-actions">
            <span className="location">
              <MapPin size={15} />
              Cochabamba, Bolivia
            </span>
            <div className="top-divider" />
            <Button
              className="icon-button notification-button"
              aria-label="Notificaciones"
              onClick={() => {
                setModal("notifications");
                setNotificationsRead(true);
              }}
            >
              <Bell size={19} />
              {!notificationsRead && <i />}
            </Button>
            <Button
              className="icon-button cart-button"
              aria-label={`Carrito, ${cartCount} productos`}
              onClick={() => setModal("cart")}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </Button>
            <Button
              className="avatar top-avatar"
              aria-label="Mi perfil"
              onClick={() => setModal("profile")}
            >
              {profile.name.charAt(0)}
            </Button>
          </div>
        </header>

        <main>{children}</main>
      </div>

      {usePathname() !== "/jarvis" && (
        <Button
          className="floating-jarvis"
          onClick={() => go("/jarvis")}
        >
          <Sparkles size={18} />
          <span>Pregúntale a Jarvis</span>
          <span className="floating-dot" />
        </Button>
      )}

      {toast && (
        <div className="toast" role="status">
          <Check size={19} />
          {toast}
          <Button
            className="icon-button"
            aria-label="Cerrar aviso"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {modal && (
        <Modal
          title={
            modal === "cart"
              ? "Tu carrito en el Paseo"
              : modal === "qr"
                ? "Tu tarjeta Paseo Points"
                : modal === "profile"
                  ? "Tu cuenta en el Paseo"
                  : modal === "shop"
                    ? selectedShop?.name || "Establecimiento"
                    : modal === "notifications"
                      ? "Lo nuevo en tu Paseo"
                      : modal === "cowork"
                        ? "Un espacio para tus ideas"
                        : modal.startsWith("redeem-")
                          ? "Tu próxima recompensa"
                          : modal === "product"
                            ? "Nuevo producto"
                            : modal === "new-shop"
                              ? "Registrar establecimiento"
                              : modal === "promo"
                                ? "Nueva promoción"
                                : modal === "referral"
                                  ? "El Paseo se disfruta mejor acompañado"
                                  : modal === "contact"
                                    ? "Conecta con Paseo Aranjuez"
                                    : "Un ecosistema digital integral"
          }
          close={() => setModal(null)}
        >
          {modal === "cart" &&
            (cartItems.length ? (
              <>
                <div className="mini-note">
                  <MapPin size={18} />
                  Retiro presencial en cada comercio. No incluye delivery.
                </div>
                {cartItems.map(({ product: p, quantity }) => (
                  <div className="cart-line" key={p.id}>
                    <img src={p.image} alt="" />
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {shopOf(p.shop).name} · {shopOf(p.shop).floor}
                      </small>
                      <strong>{money(p.price * quantity)}</strong>
                    </div>
                    <div className="quantity">
                      <Button
                        aria-label={`Quitar uno de ${p.name}`}
                        onClick={() =>
                          setCart((prev) => ({
                            ...prev,
                            [p.id]: Math.max(0, quantity - 1),
                          }))
                        }
                      >
                        <Minus size={14} />
                      </Button>
                      <span>{quantity}</span>
                      <Button
                        aria-label={`Añadir uno de ${p.name}`}
                        onClick={() => addCart(p)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="checkout-fields">
                  <label>
                    Horario de retiro
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                    >
                      <option>Hoy · 17:00 a 18:00</option>
                      <option>Hoy · 18:00 a 19:00</option>
                      <option>Mañana · 12:00 a 13:00</option>
                    </select>
                  </label>
                  <label>
                    Forma de pago
                    <select
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    >
                      <option>Pago al retirar</option>
                      <option>QR simulado</option>
                    </select>
                  </label>
                </div>
                {payment === "QR simulado" && (
                  <div className="demo-payment">
                    <QR value={`DEMO-NO-PAGAR:${total}`} />
                    <p>
                      QR ilustrativo. No procesa pagos ni representa una cuenta
                      bancaria.
                    </p>
                  </div>
                )}
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{money(total)}</strong>
                </div>
                <p className="green small">
                  Esta compra genera +{Math.floor(total * equivalence)} Paseo
                  Points.
                </p>
                <Button className="primary full" onClick={checkout}>
                  Confirmar pedido de demostración
                  <ArrowRight size={17} />
                </Button>
                <p className="small muted">
                  Ningún cobro o pedido real será realizado. Información
                  guardada solo en este navegador.
                </p>
              </>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={36} />
                <Heading>Algo bueno está por llegar</Heading>
                <p>Añade tus favoritos y ven a recogerlos al Paseo.</p>
                <Button
                  className="primary"
                  onClick={() => {
                    setModal(null);
                    go("PaseoYa");
                  }}
                >
                  Explorar productos
                </Button>
              </div>
            ))}
          {modal === "qr" && (
            <div className="qr-modal">
              <span className="gold-badge">
                <Trophy size={15} />
                Nivel Oro
              </span>
              <QR value={`PASEO-DEMO:${profile.email}`} />
              <Heading>{profile.name}</Heading>
              <p>{profile.email}</p>
              <strong>
                {points.toLocaleString("es-BO")} puntos disponibles
              </strong>
              <div className="mini-note">
                Presenta este QR para identificar tu cuenta de demostración. No
                es una credencial del Paseo real.
              </div>
            </div>
          )}
          {modal === "profile" && (
            <>
              <p className="muted">
                Personaliza la cuenta de demostración. No introduzcas
                contraseñas ni datos sensibles.
              </p>
              <form
                className="stack-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const d = new FormData(e.currentTarget);
                  setProfile({
                    name: String(d.get("name")),
                    email: String(d.get("email")),
                    phone: String(d.get("phone")),
                    birthday: String(d.get("birthday")),
                  });
                  setModal(null);
                  notify("Perfil guardado en este navegador.");
                }}
              >
                <label>
                  Nombre
                  <Input
                    name="name"
                    required
                    defaultValue={profile.name}
                    maxLength={30}
                  />
                </label>
                <label>
                  Correo electrónico de ejemplo
                  <Input
                    name="email"
                    type="email"
                    required
                    defaultValue={profile.email}
                  />
                </label>
                <label>
                  Celular (opcional)
                  <Input name="phone" type="tel" defaultValue={profile.phone} />
                </label>
                <label>
                  Cumpleaños (opcional)
                  <Input
                    name="birthday"
                    type="date"
                    defaultValue={profile.birthday}
                  />
                </label>
                <Button className="primary" type="submit">
                  Guardar perfil
                  <Check size={16} />
                </Button>
              </form>
              <p className="mini-note">
                Registro e inicio de sesión representados por una cuenta local
                demo. Una versión real requiere autenticación segura y backend.
              </p>
            </>
          )}
          {modal === "shop" && selectedShop && (
            <>
              <img
                className="modal-shop-image"
                src={selectedShop.image}
                alt={selectedShop.name}
              />
              <div className="between">
                <span className="eyebrow">{selectedShop.category}</span>
                <span className="green small">
                  <Star size={13} />
                  {selectedShop.rating} · Ejemplo
                </span>
              </div>
              <p>{selectedShop.description}</p>
              <div className="mini-note">
                <MapPin size={18} />
                {selectedShop.floor} · Paseo Aranjuez
              </div>
              <p className="small muted">
                Consulta horarios y disponibilidad directamente con el
                establecimiento.
              </p>
              <div className="two-buttons">
                <Button
                  className="primary"
                  onClick={() => {
                    const s = selectedShop;
                    setModal(null);
                    go("PaseoYa");
                    setSearch(s.name);
                  }}
                >
                  Ver su catálogo
                  <ArrowRight size={16} />
                </Button>
                <Button
                  className="outline"
                  onClick={() => toggleFavorite(selectedShop.id)}
                >
                  <Heart size={16} />
                  {favorites.includes(selectedShop.id)
                    ? "Guardado"
                    : "Guardar lugar"}
                </Button>
              </div>
            </>
          )}
          {modal === "notifications" && (
            <>
              {[
                {
                  title: "Tu nivel Oro tiene beneficios",
                  text: `Tienes ${points} puntos para convertir en nuevas experiencias.`,
                },
                {
                  title: "Tu próxima compra, sin filas",
                  text: "Descubre PaseoYa y recoge tu pedido personalmente.",
                },
                ...orders
                  .slice(0, 2)
                  .map((o) => ({ title: o.id, text: orderStates[o.state] })),
              ].map((n) => (
                <div className="movement" key={n.title}>
                  <span className="movement-icon">
                    <Bell size={17} />
                  </span>
                  <div>
                    <strong>{n.title}</strong>
                    <small>{n.text}</small>
                  </div>
                </div>
              ))}
              <p className="small muted">
                Notificaciones locales de demostración.
              </p>
            </>
          )}
          {modal === "cowork" && (
            <>
              <img
                className="modal-shop-image"
                src="/assets/paseo-building.jpg"
                alt="Sala de reunión"
              />
              <p>
                Oficinas A–D y cowork con proyector, vista panorámica y alquiler
                flexible.
              </p>
              <form
                className="stack-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const d = new FormData(e.currentTarget);
                  setReservations((prev) => [
                    ...prev,
                    `${d.get("space")} · ${d.get("date")} · ${d.get("time")}`,
                  ]);
                  setModal(null);
                  notify(
                    "Solicitud de ejemplo guardada. No se envió una reserva real.",
                  );
                }}
              >
                <label>
                  Espacio
                  <select name="space">
                    <option>Cowork por hora</option>
                    <option>Cowork por día</option>
                    <option>Oficina tipo A</option>
                    <option>Oficina tipo B</option>
                    <option>Oficina tipo C</option>
                    <option>Oficina tipo D</option>
                  </select>
                </label>
                <label>
                  Fecha
                  <Input
                    name="date"
                    type="date"
                    required
                    min={new Date().toLocaleDateString("en-CA")}
                  />
                </label>
                <label>
                  Horario
                  <Input name="time" type="time" required />
                </label>
                <Button className="primary" type="submit">
                  Guardar solicitud demo
                  <ArrowRight size={16} />
                </Button>
              </form>
              <p className="small muted">
                Confirmación y precios reales: (+591) 61795513.
              </p>
            </>
          )}
          {modal.startsWith("redeem-") &&
            (() => {
              const r = rewards.find((r) => modal === `redeem-${r.id}`)!;
              return (
                <div className="redeem-modal">
                  <span className="reward-icon">
                    <r.icon size={30} />
                  </span>
                  <Heading>{r.title}</Heading>
                  <p>{r.description}</p>
                  <div className="cart-total">
                    <span>Puntos a canjear</span>
                    <strong>{r.cost} pts</strong>
                  </div>
                  <p>
                    Tu saldo después del canje:{" "}
                    <strong>{points - r.cost} puntos</strong>.
                  </p>
                  <Button
                    className="primary full"
                    onClick={() => {
                      redeem(r);
                      setModal(null);
                    }}
                  >
                    Confirmar canje de demostración
                    <Gift size={16} />
                  </Button>
                </div>
              );
            })()}
          {modal === "product" && (
            <form
              className="stack-form"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setProducts((prev) => [
                  ...prev,
                  {
                    id: uid(),
                    name: String(d.get("name")),
                    shop: merchantShop,
                    price: Number(d.get("price")),
                    stock: Number(d.get("stock")),
                    category: shopOf(merchantShop).category,
                    image: shopOf(merchantShop).image,
                  },
                ]);
                setModal(null);
                notify("Producto publicado en el marketplace de demostración.");
              }}
            >
              <label>
                Nombre
                <Input name="name" required maxLength={80} />
              </label>
              <label>
                Precio (Bs)
                <Input name="price" type="number" min="1" required />
              </label>
              <label>
                Stock
                <Input name="stock" type="number" min="0" step="1" required />
              </label>
              <Button className="primary" type="submit">
                Publicar producto
              </Button>
            </form>
          )}
          {modal === "new-shop" && (
            <form
              className="stack-form"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setExtraShops((prev) => [
                  ...prev,
                  {
                    id: uid(),
                    name: String(d.get("name")),
                    floor: String(d.get("floor")),
                    category: String(d.get("category")),
                    image: "/assets/paseo-exterior.jpg",
                    rating: "Nuevo",
                    description:
                      "Nuevo establecimiento del catálogo de demostración.",
                  },
                ]);
                setModal(null);
                notify("Establecimiento registrado en la demo.");
              }}
            >
              <label>
                Nombre
                <Input name="name" required maxLength={70} />
              </label>
              <label>
                Categoría
                <select name="category">
                  {categories.slice(1).map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Piso
                <select name="floor">
                  {[
                    "Planta baja",
                    "Primer piso",
                    "Segundo piso",
                    "Tercer piso",
                    "Cuarto piso",
                  ].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </label>
              <Button className="primary" type="submit">
                Registrar comercio
              </Button>
            </form>
          )}
          {modal === "promo" && (
            <form
              className="stack-form"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setPromos((prev) => [...prev, String(d.get("title"))]);
                setModal(null);
                notify(
                  "Promoción de ejemplo creada. Jarvis ya puede consultarla.",
                );
              }}
            >
              <label>
                Descripción de la promoción
                <Input
                  name="title"
                  required
                  maxLength={100}
                  placeholder="Puntos dobles este fin de semana"
                />
              </label>
              <p className="small muted">
                Publicación informativa. No modifica automáticamente precios o
                reglas de puntos.
              </p>
              <Button className="primary" type="submit">
                Publicar promoción
              </Button>
            </form>
          )}
          {modal === "referral" && (
            <div className="qr-modal">
              <Users size={40} />
              <Heading>Comparte tu próximo plan</Heading>
              <p>Tu código de invitación de demostración:</p>
              <strong className="coupon-code">
                PASEO-
                {profile.name.toUpperCase().replace(/\s/g, "").slice(0, 10)}
              </strong>
              <Button
                className="primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `PASEO-${profile.name.toUpperCase().replace(/\s/g, "").slice(0, 10)}`,
                    );
                    notify("Código copiado.");
                  } catch {
                    notify(
                      "No se pudo copiar. Selecciona el código para compartirlo.",
                    );
                  }
                }}
              >
                Copiar código
              </Button>
              <p className="small muted">
                El sistema real de referidos y sus bonificaciones forman parte
                de la evolución del producto.
              </p>
            </div>
          )}
          {modal === "contact" && (
            <>
              <div className="contact-logo">
                <img src="/assets/paseo-logo.png" alt="Paseo Aranjuez" />
              </div>
              <p>
                Un lugar donde se combinan los negocios, el placer y el
                entretenimiento.
              </p>
              <div className="movement">
                <MapPin size={20} />
                <div>
                  <strong>Cochabamba, Bolivia</strong>
                  <small>Visita el Paseo y descubre sus espacios.</small>
                </div>
              </div>
              <div className="movement">
                <MessageCircle size={20} />
                <div>
                  <strong>(+591) 61795513</strong>
                  <small>info@paseoaranjuez.com</small>
                </div>
              </div>
              {createElement(
                "a",
                {
                  className: "button primary full",
                  href: "https://paseoaranjuez.com/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                "Visitar sitio oficial",
                createElement(ArrowUpRight, { size: 16 }),
              )}
            </>
          )}
          {modal === "project" && (
            <div className="project-content">
              <span className="eyebrow">HACKATHON BY PASEO ARANJUEZ</span>
              <Heading>Una experiencia que conecta los tres retos</Heading>
              <p>
                Mockup interactivo inspirado en el Documento Oficial de Retos y
                en la oferta del sitio de Paseo Aranjuez.
              </p>
              <div className="project-module">
                <Gift size={21} />
                <div>
                  <strong>01 · Paseo Points</strong>
                  <p>
                    Perfil local, QR, compras, movimientos, beneficios, canjes,
                    niveles, misión, cupones y validación comercial.
                  </p>
                </div>
              </div>
              <div className="project-module">
                <Sparkles size={21} />
                <div>
                  <strong>02 · Jarvis Paseo</strong>
                  <p>
                    Chat local, historial, lectura por voz, respuestas en
                    español e inglés, catálogo, ubicaciones, eventos,
                    promociones y recomendaciones.
                  </p>
                </div>
              </div>
              <div className="project-module">
                <ShoppingBag size={21} />
                <div>
                  <strong>03 · PaseoYa</strong>
                  <p>
                    Directorio, búsqueda global, categorías, favoritos,
                    inventario, carrito, pedido, horario, PIN y ciclo completo
                    de retiro presencial.
                  </p>
                </div>
              </div>
              <Heading level={3}>Usuarios y arquitectura</Heading>
              <p>
                Cliente, comercio y administrador. Frontend Next.js + TypeScript
                + Tailwind. Estado persistido en localStorage, QR generado
                localmente. Base de datos Supabase (ver bd.md). No hay cobros ni
                IA real conectados.
              </p>
              <Heading level={3}>
                Evolución para una implementación real
              </Heading>
              <p>
                API con permisos por rol; base de datos para clientes, negocios,
                productos, órdenes, puntos y canjes; operaciones
                transaccionales; pagos QR; IA con base de conocimiento
                verificada; voz y WhatsApp; mapas oficiales; analítica,
                prevención de fraude, referidos, cumpleaños y geolocalización.
              </p>
              <Heading level={3}>Demostración sugerida</Heading>
              <ol>
                <li>Pregunta a Jarvis por un regalo.</li>
                <li>
                  Selecciona un producto en PaseoYa y confirma el pedido demo.
                </li>
                <li>Consulta los puntos ganados y canjea un beneficio.</li>
                <li>
                  En Comercio, prepara el pedido. En Mi actividad, registra tu
                  llegada.
                </li>
                <li>
                  Valida el PIN de retiro y el código de cupón en Comercio.
                </li>
              </ol>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
