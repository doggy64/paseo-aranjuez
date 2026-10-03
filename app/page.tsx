"use client";

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

export default function PaseoAranjuez() {
  const [page, setPage] = useState<Page>("Inicio");
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [profile, setProfile] = useSaved("paseo-profile-v1", {
    name: "Valentina",
    email: "valentina@ejemplo.com",
    phone: "",
    birthday: "",
  });
  const [points, setPoints] = useSaved("paseo-points-v1", 1250);
  const [favorites, setFavorites] = useSaved<string[]>(
    "paseo-favorites-v1",
    [],
  );
  const [products, setProducts] = useSaved<Product[]>(
    "paseo-products-v1",
    initialProducts,
  );
  const [cart, setCart] = useSaved<Record<string, number>>(
    "paseo-cart-v1",
    {},
  );
  const [orders, setOrders] = useSaved<Order[]>("paseo-orders-v1", []);
  const [movements, setMovements] = useSaved<Movement[]>(
    "paseo-movements-v1",
    [
      {
        id: "initial1",
        title: "Compra en PUMA",
        points: 590,
        date: "18/04/2026",
      },
      {
        id: "initial2",
        title: "Bienvenida al Paseo",
        points: 200,
        date: "17/04/2026",
      },
      {
        id: "initial3",
        title: "Tus visitas anteriores",
        points: 460,
        date: "16/04/2026",
      },
    ],
  );
  const [coupons, setCoupons] = useSaved<
    { id: string; title: string; code: string; used: boolean }[]
  >("paseo-coupons-v1", []);
  const [reservations, setReservations] = useSaved<string[]>(
    "paseo-reservations-v1",
    [],
  );
  const [extraShops, setExtraShops] = useSaved<Shop[]>(
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
  const [toast, setToast] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [floor, setFloor] = useState("Todos los pisos");
  const [merchantShop, setMerchantShop] = useState("cayenna");
  const [validation, setValidation] = useState("");
  const [equivalence, setEquivalence] = useSaved("paseo-equivalence-v1", 1);
  const [activityTab, setActivityTab] = useState("Pedidos");
  const [notificationsRead, setNotificationsRead] = useSaved(
    "paseo-read-v1",
    false,
  );

  const allShops = [...shops, ...extraShops];
  const shopOf = (id: string) => allShops.find((s) => s.id === id) || shops[0];
  const notify = (message: string) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  const go = (next: Page, cat = "Todos") => {
    setPage(next);
    setCategory(cat);
    setSearch("");
    setMobileMenu(false);
    setOnlyFavorites(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const addMovement = (title: string, amount: number) => {
    setPoints((p) => p + amount);
    setMovements((prev) => [
      { id: uid(), title, points: amount, date: dateNow() },
      ...prev,
    ]);
  };

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
          onClick={() => go("Inicio")}
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
              className={`nav-item ${page === n.name ? "active" : ""}`}
              onClick={() => go(n.name)}
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
            <Button onClick={() => go("Jarvis Paseo")}>
              Hablar con Jarvis
              <ArrowUpRight size={15} />
            </Button>
          </div>
          <div className="role-nav">
            <Button
              className={page === "Comercio" ? "selected" : ""}
              onClick={() => go("Comercio")}
            >
              <Store size={16} />
              Portal de comercios
              <ArrowUpRight size={13} />
            </Button>
            <Button
              className={page === "Administración" ? "selected" : ""}
              onClick={() => go("Administración")}
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
            <strong>{page}</strong>
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

        <main>
          {/* ── INICIO ── */}
          {page === "Inicio" && (
            <>
              <div className="welcome-heading">
                <div>
                  <div className="welcome-eyebrow">
                    <span className="green-dot" />
                    TU PRÓXIMA EXPERIENCIA EMPIEZA AQUÍ
                  </div>
                  <Heading level={1}>
                    Hola, {profile.name}. <span>Bienvenida a tu Paseo.</span>
                  </Heading>
                  <p>
                    Descubre, disfruta y conecta. Todo lo que te gusta, en un
                    solo lugar.
                  </p>
                </div>
                <Button
                  className="outline map-top"
                  onClick={() => {
                    go("Explorar el Paseo");
                    setMapView(true);
                  }}
                >
                  <Map size={16} />
                  Ver mapa del Paseo
                  <ArrowUpRight size={15} />
                </Button>
              </div>
              <div className="home-top-grid">
                <div className="hero">
                  <img
                    className="hero-image"
                    src="/assets/paseo-exterior.jpg"
                    alt="Vista exterior de Paseo Aranjuez"
                  />
                  <div className="hero-shade" />
                  <div className="hero-content">
                    <span className="hero-pill">
                      <Leaf size={12} />
                      MÁS QUE UN LUGAR, TU LUGAR
                    </span>
                    <Heading level={2}>
                      Hay un Paseo
                      <br />
                      para cada momento.
                    </Heading>
                    <p>
                      Sabores que sorprenden, tiendas que inspiran
                      <br />y experiencias que quieres repetir.
                    </p>
                    <Button
                      className="hero-cta"
                      onClick={() => go("Explorar el Paseo")}
                    >
                      Descubre el Paseo
                      <ArrowUpRight size={17} />
                    </Button>
                  </div>
                  <div className="hero-footer">
                    <span>
                      <MapPin size={13} />
                      Paseo Aranjuez · Cochabamba
                    </span>
                    <div className="hero-dots">
                      <i className="active" />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
                <div className="home-right">
                  {pointsCard()}
                  <Button
                    className="jarvis-teaser"
                    onClick={() => go("Jarvis Paseo")}
                  >
                    <span className="jarvis-orb">
                      <Sparkles size={22} />
                    </span>
                    <span>
                      <strong>Un plan perfecto, en segundos</strong>
                      <small>Pregúntale a Jarvis. Él conoce el Paseo.</small>
                    </span>
                    <ArrowUpRight size={19} />
                  </Button>
                </div>
              </div>
              <div className="quick-actions">
                <Button onClick={() => go("PaseoYa")}>
                  <span className="quick-icon peach">
                    <ShoppingBag size={20} />
                  </span>
                  <span>
                    <strong>Compra en PaseoYa</strong>
                    <small>Elige online, recoge en el Paseo</small>
                  </span>
                  <ArrowUpRight size={17} />
                </Button>
                <Button onClick={() => go("Paseo Points")}>
                  <span className="quick-icon gold">
                    <Gift size={20} />
                  </span>
                  <span>
                    <strong>Tus puntos, tus beneficios</strong>
                    <small>Cada visita tiene su recompensa</small>
                  </span>
                  <ArrowUpRight size={17} />
                </Button>
                <Button onClick={() => go("Eventos y experiencias")}>
                  <span className="quick-icon lavender">
                    <CalendarDays size={20} />
                  </span>
                  <span>
                    <strong>Siempre hay algo por vivir</strong>
                    <small>Descubre eventos y experiencias</small>
                  </span>
                  <ArrowUpRight size={17} />
                </Button>
              </div>
              <section className="discover-section">
                <div className="section-title">
                  <div>
                    <span className="eyebrow">ENCUENTRA TU LUGAR</span>
                    <Heading>Un Paseo, muchas posibilidades</Heading>
                  </div>
                  <Button
                    className="text-link"
                    onClick={() => go("Explorar el Paseo")}
                  >
                    Ver todo el directorio
                    <ArrowRight size={16} />
                  </Button>
                </div>
                <div className="home-categories">
                  {categories.slice(1).map((c) => (
                    <Button
                      key={c.name}
                      onClick={() => go("Explorar el Paseo", c.name)}
                    >
                      <span>
                        <c.icon size={24} strokeWidth={1.5} />
                      </span>
                      <strong>
                        {c.name === "Oficinas y servicios"
                          ? "Oficinas & servicios"
                          : c.name}
                      </strong>
                    </Button>
                  ))}
                </div>
              </section>
              <section>
                <div className="section-title">
                  <div>
                    <span className="eyebrow">HECHO PARA TI</span>
                    <Heading>Tu próximo favorito está aquí</Heading>
                    <p>Lugares que vale la pena descubrir, una y otra vez.</p>
                  </div>
                  <Button
                    className="text-link"
                    onClick={() => go("Explorar el Paseo")}
                  >
                    Explorar lugares
                    <ArrowRight size={16} />
                  </Button>
                </div>
                <div className="cards-grid home-shops">
                  {shops.slice(0, 4).map(shopCard)}
                </div>
              </section>
              <div className="bottom-home-grid">
                <section>
                  <div className="section-title">
                    <Heading>El Paseo se vive</Heading>
                    <Button
                      className="text-link"
                      onClick={() => go("Eventos y experiencias")}
                    >
                      Ver agenda
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                  <div className="mini-event">
                    <div className="date-tile">
                      <strong>24</strong>
                      <span>ABR</span>
                    </div>
                    <div>
                      <span className="eyebrow">MÚSICA & GASTRONOMÍA</span>
                      <Heading level={3}>
                        Atardeceres con música en vivo
                      </Heading>
                      <p>Terraza gourmet · 19:00</p>
                    </div>
                    <Button
                      className="icon-button"
                      aria-label="Ver evento"
                      onClick={() => go("Eventos y experiencias")}
                    >
                      <ArrowUpRight size={20} />
                    </Button>
                  </div>
                </section>
                <div className="mission-home">
                  <Trophy size={26} />
                  <div>
                    <span className="eyebrow">TU RETO DEL MES</span>
                    <Heading level={3}>Descubre más. Gana más.</Heading>
                    <p>
                      Visita 3 comercios diferentes y recibe 150 puntos extra.
                    </p>
                  </div>
                  <Button
                    className="icon-button"
                    aria-label="Ver misiones"
                    onClick={() => go("Paseo Points")}
                  >
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── EXPLORAR EL PASEO ── */}
          {page === "Explorar el Paseo" && (
            <>
              {sectionHead(
                "Encuentra tu lugar en el Paseo",
                "UN LUGAR. MIL POSIBILIDADES.",
                "Tiendas, sabores, servicios y espacios para conectar con lo que te gusta.",
              )}
              <div className="toolbar">
                <div className="search-field">
                  <Search size={18} />
                  <Input
                    aria-label="Buscar establecimientos"
                    placeholder="Busca una tienda, un sabor o un servicio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filtrar por piso"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  {[
                    "Todos los pisos",
                    "Planta baja",
                    "Primer piso",
                    "Segundo piso",
                    "Tercer piso",
                    "Cuarto piso",
                  ].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <Button
                  className={`outline ${onlyFavorites ? "selected" : ""}`}
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                >
                  <Heart size={16} />
                  Favoritos
                </Button>
                <Button
                  className="outline"
                  onClick={() => setMapView(!mapView)}
                >
                  <Map size={16} />
                  {mapView ? "Ver directorio" : "Ver mapa"}
                </Button>
              </div>
              {categoryBar()}
              {mapView ? (
                <div className="map-panel">
                  <div className="section-title">
                    <div>
                      <Heading>Tu guía dentro del Paseo</Heading>
                      <p>
                        Esquema de navegación ilustrativo, no es un plano
                        oficial.
                      </p>
                    </div>
                    <MapPin size={25} />
                  </div>
                  <div className="floor-map">
                    {[
                      "Cuarto piso",
                      "Tercer piso",
                      "Segundo piso",
                      "Primer piso",
                      "Planta baja",
                    ].map((f) => (
                      <div className="map-floor" key={f}>
                        <strong>{f}</strong>
                        <div>
                          {allShops
                            .filter(
                              (s) =>
                                s.floor.toLowerCase() === f.toLowerCase(),
                            )
                            .map((s) => (
                              <Button
                                key={s.id}
                                onClick={() => {
                                  setSelectedShop(s);
                                  setModal("shop");
                                }}
                              >
                                <MapPin size={15} />
                                {s.name}
                              </Button>
                            ))}
                          {f === "Tercer piso" && (
                            <span>Mercado gastronómico · Sky Games</span>
                          )}
                          {f === "Cuarto piso" && (
                            <span>Terraza gourmet · Sky Games</span>
                          )}
                          {f === "Primer piso" && (
                            <span>Moda · Belleza · Accesorios</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="info-strip">
                    <BriefcaseBusiness size={18} />
                    Torres empresariales · Oficinas A–D y cowork
                    <Button
                      className="text-link"
                      onClick={() => setModal("cowork")}
                    >
                      Solicitar información
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              ) : category === "Oficinas y servicios" ? (
                <div className="office-feature">
                  <img
                    src="/assets/paseo-building.jpg"
                    alt="Oficinas y sala de reunión de Paseo Aranjuez"
                  />
                  <div>
                    <span className="eyebrow">TU NEGOCIO, EN OTRO NIVEL</span>
                    <Heading>Espacios para grandes ideas</Heading>
                    <p>
                      Oficinas tipo A, B, C y D en las torres empresariales.
                      Cowork con proyector, vistas panorámicas y alquiler
                      flexible por hora, día o mes.
                    </p>
                    <div className="tags">
                      <span>Oficinas</span>
                      <span>Cowork</span>
                      <span>Empresas</span>
                      <span>Servicios</span>
                    </div>
                    <Button
                      className="primary"
                      onClick={() => setModal("cowork")}
                    >
                      Solicitar una reserva
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="results-caption">
                    <span>{filteredShops.length} lugares para descubrir</span>
                    <span>
                      Directorio seleccionado · Calificaciones de ejemplo
                    </span>
                  </div>
                  <div className="cards-grid">
                    {filteredShops.map(shopCard)}
                  </div>
                  {!filteredShops.length && (
                    <div className="empty-state">
                      <Search size={30} />
                      <Heading>No encontramos ese lugar</Heading>
                      <p>
                        Prueba otra categoría o guarda tus comercios favoritos.
                      </p>
                      <Button
                        className="outline"
                        onClick={() => {
                          setSearch("");
                          setCategory("Todos");
                          setOnlyFavorites(false);
                          setFloor("Todos los pisos");
                        }}
                      >
                        Ver todos los lugares
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── PASEOYA ── */}
          {page === "PaseoYa" && (
            <>
              {sectionHead(
                "Lo eliges aquí. Lo disfrutas en el Paseo.",
                "PASEOYA · TU MARKETPLACE",
                "Descubre productos de tus comercios favoritos, compra online y recoge personalmente.",
              )}
              <div className="pickup-banner">
                <span className="quick-icon">
                  <ShoppingBag size={23} />
                </span>
                <div>
                  <strong>Tu pedido te espera en Paseo Aranjuez</strong>
                  <p>
                    Retiro presencial obligatorio. Sin delivery, con muchas
                    razones para venir.
                  </p>
                </div>
                <span>
                  <Gift size={17} />
                  Cada compra suma puntos
                </span>
              </div>
              <div className="toolbar">
                <div className="search-field">
                  <Search size={18} />
                  <Input
                    aria-label="Buscar productos"
                    placeholder="¿Qué estás buscando? Prueba audífonos, flores o café..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  className={`outline ${onlyFavorites ? "selected" : ""}`}
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                >
                  <Heart size={16} />
                  Favoritos
                </Button>
                <Button className="primary" onClick={() => setModal("cart")}>
                  <ShoppingCart size={17} />
                  Mi carrito ({cartCount})
                </Button>
              </div>
              {categoryBar()}
              <div className="results-caption">
                <span>
                  {filteredProducts.length} productos · Precios e inventario de
                  demostración
                </span>
                <span>Fotos de los establecimientos, no del producto</span>
              </div>
              <div className="cards-grid">
                {filteredProducts.map(productCard)}
              </div>
              {!filteredProducts.length && (
                <div className="empty-state">
                  <ShoppingBag size={30} />
                  <Heading>No hay productos para esta selección</Heading>
                  <p>Prueba otro término o explora todas las categorías.</p>
                  <Button
                    className="outline"
                    onClick={() => {
                      setSearch("");
                      setCategory("Todos");
                      setOnlyFavorites(false);
                    }}
                  >
                    Ver catálogo
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ── PASEO POINTS ── */}
          {page === "Paseo Points" && (
            <>
              {sectionHead(
                "Cada momento cuenta. Y suma.",
                "PASEO POINTS · FIDELIZACIÓN",
                "Una sola cuenta, todos tus comercios. Convierte tus compras en experiencias.",
              )}
              <div className="points-overview">
                {pointsCard(true)}
                <div className="white-card digital-card">
                  <div>
                    <span className="eyebrow">TU IDENTIDAD EN EL PASEO</span>
                    <Heading level={3}>Tu tarjeta digital</Heading>
                    <p>
                      Presenta tu código en el comercio para registrar compras y
                      sumar puntos.
                    </p>
                    <Button
                      className="outline"
                      onClick={() => setModal("qr")}
                    >
                      <QrCode size={17} />
                      Mostrar mi código
                    </Button>
                  </div>
                  <QR value={`PASEO-DEMO:${profile.email}`} />
                </div>
              </div>
              <div className="section-title">
                <div>
                  <Heading>Beneficios que dan ganas de volver</Heading>
                  <p>
                    Canjea tus puntos y presenta el cupón en el establecimiento.
                  </p>
                </div>
                <span className="muted small">Catálogo de demostración</span>
              </div>
              <div className="rewards-grid">
                {rewards.map((r) => (
                  <div className="reward-card" key={r.id}>
                    <span className="reward-icon">
                      <r.icon size={29} />
                    </span>
                    <span className="eyebrow">{r.shop}</span>
                    <Heading level={3}>{r.title}</Heading>
                    <p>{r.description}</p>
                    <div>
                      <strong>
                        {r.cost} <small>puntos</small>
                      </strong>
                      <Button
                        className="outline"
                        disabled={points < r.cost}
                        onClick={() => {
                          setModal(`redeem-${r.id}`);
                        }}
                      >
                        Canjear
                        <ArrowRight size={15} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="two-columns">
                <div className="white-card">
                  <div className="section-title">
                    <Heading level={3}>Tu reto del mes</Heading>
                    <span className="gold-badge">+150 pts</span>
                  </div>
                  <p>
                    Compra en 3 comercios diferentes para descubrir nuevos
                    favoritos.
                  </p>
                  {(() => {
                    const visited = new Set(
                      orders.flatMap((o) =>
                        o.items.map((i) => i.product.shop),
                      ),
                    ).size;
                    return (
                      <>
                        <div className="mission-progress">
                          <div
                            style={{
                              width: `${Math.min(100, (visited / 3) * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="between">
                          <span>{Math.min(visited, 3)} de 3 comercios</span>
                          <Button
                            className="text-link"
                            disabled={
                              visited < 3 ||
                              movements.some(
                                (m) => m.title === "Reto: descubre 3 comercios",
                              )
                            }
                            onClick={() => {
                              addMovement("Reto: descubre 3 comercios", 150);
                              notify("¡Misión completada! Ganaste 150 puntos.");
                            }}
                          >
                            {movements.some(
                              (m) => m.title === "Reto: descubre 3 comercios",
                            )
                              ? "Completado"
                              : visited >= 3
                                ? "Recibir puntos"
                                : "En progreso"}
                            <Trophy size={16} />
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                  <div className="level-list">
                    {["Bronce", "Plata", "Oro", "Platinum"].map((l) => (
                      <span key={l} className={l === "Oro" ? "current" : ""}>
                        <Trophy size={14} />
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="small muted">
                    Niveles ilustrativos. Cumpleaños, referidos y bonificaciones
                    configurables en la evolución del producto.
                  </p>
                  <Button
                    className="outline"
                    onClick={() => setModal("referral")}
                  >
                    <Users size={16} />
                    Invita a alguien al Paseo
                  </Button>
                </div>
                <div className="white-card">
                  <div className="section-title">
                    <Heading level={3}>Tus últimos movimientos</Heading>
                    <Button
                      className="text-link"
                      onClick={() => {
                        go("Mi actividad");
                        setActivityTab("Puntos");
                      }}
                    >
                      Ver todos
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                  {movements.slice(0, 4).map((m) => (
                    <div className="movement" key={m.id}>
                      <span
                        className={`movement-icon ${
                          m.points < 0 ? "negative" : ""
                        }`}
                      >
                        <ArrowDownLeft size={18} />
                      </span>
                      <div>
                        <strong>{m.title}</strong>
                        <small>{m.date}</small>
                      </div>
                      <strong className={m.points < 0 ? "muted" : "green"}>
                        {m.points > 0 ? "+" : ""}
                        {m.points} pts
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── JARVIS PASEO ── */}
          {page === "Jarvis Paseo" && (
            <>
              {sectionHead(
                "Tu Paseo, con un poco de magia.",
                "JARVIS PASEO · ASISTENTE",
                "Encuentra lo que necesitas, descubre algo nuevo y deja que el plan empiece aquí.",
              )}
              <div className="chat-layout">
                <div className="chat-card">
                  <div className="chat-header">
                    <span className="jarvis-orb">
                      <Sparkles size={23} />
                    </span>
                    <div>
                      <strong>Jarvis Paseo</strong>
                      <small>
                        <span className="green-dot" />
                        Asistente de demostración
                      </small>
                    </div>
                    <select
                      aria-label="Idioma del asistente"
                      value={chatLanguage}
                      onChange={(e) => setChatLanguage(e.target.value)}
                    >
                      <option>Español</option>
                      <option>English</option>
                    </select>
                    <Button
                      className="icon-button"
                      aria-label="Nueva conversación"
                      onClick={() => {
                        setMessages([]);
                        notify("Nueva conversación iniciada.");
                      }}
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                  <div
                    className="chat-messages"
                    ref={(element) => {
                      if (element) element.scrollTop = element.scrollHeight;
                    }}
                  >
                    <div className="chat-welcome">
                      <Sparkles size={35} />
                      <Heading>Hola, {profile.name}. ¿Qué hacemos hoy?</Heading>
                      <p>
                        Un regalo especial, tu café favorito o un plan distinto.
                        <br />
                        Estoy aquí para ayudarte a encontrarlo.
                      </p>
                    </div>
                    {messages.map((m, i) => (
                      <div className={`chat-message ${m.role}`} key={i}>
                        {m.role === "assistant" && <Sparkles size={17} />}
                        <div>
                          <p>{m.text}</p>
                          {m.role === "assistant" && (
                            <div className="chat-response-actions">
                              <Button
                                className="small-link"
                                onClick={() => go("PaseoYa")}
                              >
                                Ver productos
                                <ArrowRight size={13} />
                              </Button>
                              <Button
                                className="small-link"
                                onClick={() => {
                                  go("Explorar el Paseo");
                                  setMapView(true);
                                }}
                              >
                                Ver mapa
                                <MapPin size={13} />
                              </Button>
                              <Button
                                className="icon-button"
                                aria-label="Escuchar respuesta"
                                onClick={() => {
                                  if (!("speechSynthesis" in window))
                                    return notify(
                                      "Tu navegador no admite lectura por voz.",
                                    );
                                  const speech = new SpeechSynthesisUtterance(
                                    m.text,
                                  );
                                  speech.lang =
                                    chatLanguage === "English"
                                      ? "en-US"
                                      : "es-BO";
                                  window.speechSynthesis.speak(speech);
                                }}
                              >
                                <Volume2 size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-suggestions">
                    {[
                      "Busco un regalo",
                      "Quiero un café",
                      "¿Qué eventos hay?",
                      "¿Y mis puntos?",
                    ].map((q) => (
                      <Button key={q} onClick={() => askJarvis(q)}>
                        {q}
                      </Button>
                    ))}
                  </div>
                  <form
                    className="chat-input"
                    onSubmit={(e) => {
                      e.preventDefault();
                      askJarvis(chatInput);
                    }}
                  >
                    <Input
                      placeholder="Cuéntame, ¿qué te gustaría hacer?"
                      aria-label="Mensaje para Jarvis"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <Button
                      className="primary icon-button"
                      type="submit"
                      aria-label="Enviar mensaje"
                      disabled={!chatInput.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                  <p className="chat-disclaimer">
                    Respuestas basadas en reglas y datos de ejemplo. Sin
                    conexión a una IA o información en tiempo real.
                  </p>
                </div>
                <div className="jarvis-side">
                  <div className="white-card">
                    <span className="eyebrow">UN ASISTENTE, TODO EL PASEO</span>
                    <Heading level={3}>¿En qué puedo ayudarte?</Heading>
                    {[
                      {
                        icon: Store,
                        text: "Tiendas, productos y servicios",
                        query: "Busco un regalo",
                      },
                      {
                        icon: MapPin,
                        text: "Ubicaciones y mapa",
                        query: "¿Dónde está PUMA?",
                      },
                      {
                        icon: CalendarDays,
                        text: "Eventos y actividades",
                        query: "¿Qué eventos hay?",
                      },
                      {
                        icon: Gift,
                        text: "Promociones y beneficios",
                        query: "¿Qué promociones hay?",
                      },
                      {
                        icon: BriefcaseBusiness,
                        text: "Oficinas y cowork",
                        query: "Necesito una oficina",
                      },
                      {
                        icon: Package,
                        text: "Mis pedidos y retiros",
                        query: "¿Cómo va mi pedido?",
                      },
                    ].map((a) => (
                      <Button
                        className="jarvis-help"
                        key={a.text}
                        onClick={() => askJarvis(a.query)}
                      >
                        <a.icon size={18} />
                        {a.text}
                        <ChevronRight size={14} />
                      </Button>
                    ))}
                  </div>
                  <div className="integration-card">
                    <Sparkles size={23} />
                    <Heading level={3}>Todo se conecta</Heading>
                    <p>
                      Jarvis encuentra tu plan.
                      <br />
                      PaseoYa hace posible tu compra.
                      <br />
                      Paseo Points premia tu visita.
                    </p>
                    <div className="tags">
                      <span>Jarvis</span>
                      <ArrowRight size={13} />
                      <span>PaseoYa</span>
                      <ArrowRight size={13} />
                      <span>Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── EVENTOS Y EXPERIENCIAS ── */}
          {page === "Eventos y experiencias" && (
            <>
              {sectionHead(
                "Ven por un plan. Quédate por la experiencia.",
                "EL PASEO SE VIVE",
                "Gastronomía, cultura y diversión para compartir. Siempre hay una nueva razón para volver.",
              )}
              <div className="info-strip">
                <CalendarDays size={18} />
                Agenda ilustrativa del mockup. Confirma eventos y fechas con
                Paseo Aranjuez.
              </div>
              <div className="events-grid">
                {events.map((e) => (
                  <div className="event-card" key={e.id}>
                    <div className="event-photo">
                      <img src={e.image} alt={e.type} />
                      <span className="date-tile">
                        <strong>{e.date.split(" ")[0]}</strong>
                        <span>{e.date.split(" ")[1]}</span>
                      </span>
                    </div>
                    <div className="shop-info">
                      <span className="eyebrow">{e.type}</span>
                      <Heading level={3}>{e.title}</Heading>
                      <p>
                        <Clock3 size={14} />
                        {e.time}
                      </p>
                      <p>
                        <MapPin size={14} />
                        {e.place}
                      </p>
                      <Button
                        className={`full ${
                          reservations.includes(e.id) ? "outline" : "primary"
                        }`}
                        onClick={() => {
                          setReservations((prev) =>
                            prev.includes(e.id)
                              ? prev.filter((r) => r !== e.id)
                              : [...prev, e.id],
                          );
                          notify(
                            reservations.includes(e.id)
                              ? "Reserva de ejemplo cancelada."
                              : "¡Plan guardado! Tu reserva de demostración está en Mi actividad.",
                          );
                        }}
                      >
                        {reservations.includes(e.id) ? (
                          <>
                            <Check size={16} />
                            Reservado · Cancelar
                          </>
                        ) : (
                          <>
                            Quiero vivirlo
                            <ArrowRight size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="office-feature">
                <img
                  src="/assets/paseo-building.jpg"
                  alt="Cowork de Paseo Aranjuez"
                />
                <div>
                  <span className="eyebrow">
                    TAMBIÉN HAY LUGAR PARA TUS IDEAS
                  </span>
                  <Heading>Trabaja, conecta, crece.</Heading>
                  <p>
                    Descubre el cowork y las oficinas de las torres
                    empresariales. Flexibilidad, equipamiento y una vista que
                    inspira.
                  </p>
                  <Button
                    className="primary"
                    onClick={() => setModal("cowork")}
                  >
                    Conocer los espacios
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── MI ACTIVIDAD ── */}
          {page === "Mi actividad" && (
            <>
              {sectionHead(
                "Tu historia en el Paseo",
                "TODO LO TUYO, EN UN LUGAR",
                "Consulta tus compras, puntos, cupones y los planes que ya te están esperando.",
              )}
              <div className="category-tabs">
                {["Pedidos", "Puntos", "Cupones", "Reservas"].map((t) => (
                  <Button
                    key={t}
                    className={`category-tab ${
                      activityTab === t ? "selected" : ""
                    }`}
                    onClick={() => setActivityTab(t)}
                  >
                    {t}
                    {t === "Pedidos" && ` (${orders.length})`}
                  </Button>
                ))}
              </div>
              {activityTab === "Pedidos" &&
                (orders.length ? (
                  orders.map((o) => (
                    <div className="order-card" key={o.id}>
                      <div className="section-title">
                        <div>
                          <span className="eyebrow">
                            {o.id} · {o.date}
                          </span>
                          <Heading level={3}>
                            {o.items
                              .map((i) => shopOf(i.product.shop).name)
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .join(" + ")}
                          </Heading>
                        </div>
                        <span className="status-badge">
                          {orderStates[o.state]}
                        </span>
                      </div>
                      <div className="order-items">
                        {o.items.map((i) => (
                          <span key={i.product.id}>
                            {i.quantity} × {i.product.name} ·{" "}
                            {money(i.product.price * i.quantity)}
                          </span>
                        ))}
                      </div>
                      <div className="order-timeline">
                        {orderStates.map((s, i) => (
                          <span key={s} className={i <= o.state ? "done" : ""}>
                            <i>{i < o.state ? <Check size={12} /> : i + 1}</i>
                            <small>{s}</small>
                          </span>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div>
                          <strong>{money(o.total)}</strong>
                          <p>
                            <MapPin size={14} />
                            Retiro presencial · {o.slot}
                          </p>
                          <small>{o.payment} · Operación de ejemplo</small>
                        </div>
                        <div className="pickup-pin">
                          <span>Tu código de retiro</span>
                          <strong>{o.pin}</strong>
                          <small>Preséntalo en cada comercio</small>
                        </div>
                        <Button
                          className="outline"
                          disabled={o.state !== 3}
                          onClick={() => {
                            setOrders((prev) =>
                              prev.map((item) =>
                                item.id === o.id
                                  ? { ...item, state: 4 }
                                  : item,
                              ),
                            );
                            notify(
                              "Llegada registrada. Presenta tu PIN para recibir tu pedido.",
                            );
                          }}
                        >
                          <MapPin size={16} />
                          Ya estoy en el Paseo
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Package size={35} />
                    <Heading>Tu primera compra empieza aquí</Heading>
                    <p>Explora PaseoYa y ven a recoger algo que te encanta.</p>
                    <Button className="primary" onClick={() => go("PaseoYa")}>
                      Descubrir productos
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              {activityTab === "Puntos" && (
                <div className="white-card">
                  {movements.map((m) => (
                    <div className="movement" key={m.id}>
                      <span className="movement-icon">
                        <ArrowDownLeft size={19} />
                      </span>
                      <div>
                        <strong>{m.title}</strong>
                        <small>{m.date}</small>
                      </div>
                      <strong className={m.points > 0 ? "green" : "muted"}>
                        {m.points > 0 ? "+" : ""}
                        {m.points} pts
                      </strong>
                    </div>
                  ))}
                </div>
              )}
              {activityTab === "Cupones" &&
                (coupons.length ? (
                  <div className="rewards-grid">
                    {coupons.map((c) => (
                      <div className="reward-card" key={c.id}>
                        <Gift size={30} />
                        <Heading level={3}>{c.title}</Heading>
                        <QR value={`PASEO-CUPON:${c.code}`} />
                        <strong className="coupon-code">{c.code}</strong>
                        <span className="status-badge">
                          {c.used ? "Canje validado" : "Disponible para usar"}
                        </span>
                        <p>
                          Presenta el código en el comercio. Beneficio de
                          demostración.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Gift size={35} />
                    <Heading>Hay recompensas esperándote</Heading>
                    <p>Canjea tus puntos para obtener tu primer cupón.</p>
                    <Button
                      className="primary"
                      onClick={() => go("Paseo Points")}
                    >
                      Ver beneficios
                    </Button>
                  </div>
                ))}
              {activityTab === "Reservas" &&
                (reservations.length ? (
                  <div className="white-card">
                    {reservations.map((r) => (
                      <div className="movement" key={r}>
                        <CalendarDays size={23} />
                        <div>
                          <strong>
                            {events.find((e) => e.id === r)?.title || r}
                          </strong>
                          <small>
                            Solicitud guardada localmente · Sin confirmación
                            real
                          </small>
                        </div>
                        <Button
                          className="outline"
                          onClick={() => {
                            setReservations((prev) =>
                              prev.filter((x) => x !== r),
                            );
                            notify("Reserva cancelada.");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <CalendarDays size={35} />
                    <Heading>Haz espacio para un nuevo plan</Heading>
                    <p>Encuentra eventos o solicita tu espacio de cowork.</p>
                    <Button
                      className="primary"
                      onClick={() => go("Eventos y experiencias")}
                    >
                      Ver experiencias
                    </Button>
                  </div>
                ))}
            </>
          )}

          {/* ── COMERCIO / ADMINISTRACIÓN ── */}
          {(page === "Comercio" || page === "Administración") && (
            <>
              {sectionHead(
                page === "Comercio"
                  ? "Tu comercio, más conectado."
                  : "Un ecosistema. Una visión completa.",
                page === "Comercio"
                  ? "PORTAL DE COMERCIOS"
                  : "ADMINISTRACIÓN · PASEO ARANJUEZ",
                page === "Comercio"
                  ? "Gestiona pedidos, inventario, compras y canjes desde un mismo lugar."
                  : "Supervisa comercios, fidelización y ventas de todo el Paseo.",
              )}
              <div className="info-strip">
                <ShieldCheck size={18} />
                Vista de demostración. El cambio de rol no constituye
                autenticación ni concede acceso real.
              </div>
              <div className="admin-metrics">
                {[
                  {
                    title: "Ventas de la demo",
                    value: money(orders.reduce((a, o) => a + o.total, 0)),
                    icon: CreditCard,
                  },
                  {
                    title: "Pedidos registrados",
                    value: orders.length,
                    icon: ShoppingBag,
                  },
                  {
                    title: "Comercios del catálogo",
                    value: allShops.length,
                    icon: Store,
                  },
                  {
                    title: "Puntos disponibles",
                    value: points.toLocaleString("es-BO"),
                    icon: Gift,
                  },
                ].map((m) => (
                  <div className="white-card metric" key={m.title}>
                    <span className="quick-icon">
                      <m.icon size={22} />
                    </span>
                    <div>
                      <span>{m.title}</span>
                      <strong>{m.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
              {page === "Comercio" ? (
                <>
                  <div className="toolbar">
                    <Heading level={3}>Mi establecimiento</Heading>
                    <select
                      aria-label="Seleccionar comercio"
                      value={merchantShop}
                      onChange={(e) => setMerchantShop(e.target.value)}
                    >
                      {allShops.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      className="primary"
                      onClick={() => setModal("product")}
                    >
                      <Plus size={16} />
                      Nuevo producto
                    </Button>
                  </div>
                  <div className="two-columns">
                    <div className="white-card">
                      <Heading level={3}>
                        Registrar una compra presencial
                      </Heading>
                      <p>
                        Identifica al cliente y acredita puntos por una compra.
                      </p>
                      <form
                        className="stack-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = new FormData(e.currentTarget);
                          const customer = String(
                            form.get("customer"),
                          ).trim();
                          if (
                            customer !== profile.email &&
                            customer !== profile.phone &&
                            customer !== `PASEO-DEMO:${profile.email}`
                          )
                            return notify(
                              "Cliente no encontrado. Usa el correo de la cuenta de demostración.",
                            );
                          const amount = Number(form.get("amount"));
                          if (!(amount > 0)) return;
                          addMovement(
                            `Compra presencial · ${shopOf(merchantShop).name}`,
                            Math.floor(amount * equivalence),
                          );
                          notify(
                            "Compra registrada y puntos acreditados a tu cuenta demo.",
                          );
                          e.currentTarget.reset();
                        }}
                      >
                        <label>
                          Correo, celular o contenido del QR
                          <Input
                            name="customer"
                            required
                            placeholder={profile.email}
                          />
                        </label>
                        <label>
                          Monto de compra (Bs)
                          <Input
                            name="amount"
                            type="number"
                            min="1"
                            max="100000"
                            required
                          />
                        </label>
                        <Button className="primary" type="submit">
                          <Plus size={16} />
                          Registrar y asignar puntos
                        </Button>
                      </form>
                    </div>
                    <div className="white-card">
                      <Heading level={3}>Validar un canje</Heading>
                      <p>
                        Introduce el código del cupón que presenta el cliente.
                      </p>
                      <form
                        className="stack-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const c = coupons.find(
                            (x) =>
                              x.code === validation.trim().toUpperCase(),
                          );
                          if (!c) return notify("Cupón no encontrado.");
                          if (c.used)
                            return notify("Este cupón ya fue utilizado.");
                          setCoupons((prev) =>
                            prev.map((x) =>
                              x.id === c.id ? { ...x, used: true } : x,
                            ),
                          );
                          notify("Canje validado y registrado.");
                          setValidation("");
                        }}
                      >
                        <label>
                          Código de cupón
                          <Input
                            required
                            value={validation}
                            onChange={(e) => setValidation(e.target.value)}
                            placeholder="PASEO-123456"
                          />
                        </label>
                        <Button className="outline" type="submit">
                          <CheckCheck size={16} />
                          Validar cupón
                        </Button>
                      </form>
                      <div className="mini-note">
                        <ShieldCheck size={18} />
                        Los códigos ya utilizados no pueden validarse otra vez.
                      </div>
                    </div>
                  </div>
                  <div className="section-title">
                    <Heading>Pedidos de {shopOf(merchantShop).name}</Heading>
                    <span className="muted small">
                      Validación de retiro por PIN
                    </span>
                  </div>
                  {orders
                    .filter((o) =>
                      o.items.some((i) => i.product.shop === merchantShop),
                    )
                    .map((o) => (
                      <div className="white-card merchant-order" key={o.id}>
                        <div>
                          <strong>
                            {o.id} · {orderStates[o.state]}
                          </strong>
                          <p>
                            {o.items
                              .filter((i) => i.product.shop === merchantShop)
                              .map(
                                (i) => `${i.quantity} × ${i.product.name}`,
                              )
                              .join(", ")}
                          </p>
                          <small>
                            El estado es compartido para el pedido de
                            demostración.
                          </small>
                        </div>
                        {o.state < 4 ? (
                          <Button
                            className="primary"
                            onClick={() =>
                              setOrders((prev) =>
                                prev.map((x) =>
                                  x.id === o.id
                                    ? { ...x, state: x.state + 1 }
                                    : x,
                                ),
                              )
                            }
                          >
                            {orderStates[o.state + 1]}
                            <ArrowRight size={15} />
                          </Button>
                        ) : o.state === 4 ? (
                          <form
                            className="inline-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const pin = new FormData(e.currentTarget).get(
                                "pin",
                              );
                              if (pin !== o.pin)
                                return notify(
                                  "PIN incorrecto. No se puede entregar el pedido.",
                                );
                              setOrders((prev) =>
                                prev.map((x) =>
                                  x.id === o.id ? { ...x, state: 5 } : x,
                                ),
                              );
                              notify(
                                "Pedido entregado. Retiro presencial validado.",
                              );
                            }}
                          >
                            <Input
                              name="pin"
                              required
                              placeholder="PIN de retiro"
                              aria-label="PIN de retiro"
                            />
                            <Button className="primary" type="submit">
                              Validar entrega
                            </Button>
                          </form>
                        ) : (
                          <span className="status-badge">
                            <Check size={14} />
                            Entregado
                          </span>
                        )}
                      </div>
                    ))}
                  {!orders.some((o) =>
                    o.items.some((i) => i.product.shop === merchantShop),
                  ) && (
                    <div className="mini-note">
                      Aún no hay pedidos para este comercio. Crea uno desde
                      PaseoYa para recorrer el flujo.
                    </div>
                  )}
                  <div className="section-title">
                    <Heading>Inventario y precios</Heading>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio (Bs)</th>
                          <th>Stock</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter((p) => p.shop === merchantShop)
                          .map((p) => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>
                                <Input
                                  aria-label={`Precio de ${p.name}`}
                                  type="number"
                                  min="1"
                                  value={p.price}
                                  onChange={(e) => {
                                    const n = Number(e.target.value);
                                    setProducts((prev) =>
                                      prev.map((x) =>
                                        x.id === p.id
                                          ? { ...x, price: Math.max(1, n) }
                                          : x,
                                      ),
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <Input
                                  aria-label={`Stock de ${p.name}`}
                                  type="number"
                                  min="0"
                                  value={p.stock}
                                  onChange={(e) =>
                                    setProducts((prev) =>
                                      prev.map((x) =>
                                        x.id === p.id
                                          ? {
                                              ...x,
                                              stock: Math.max(
                                                0,
                                                Math.floor(
                                                  Number(e.target.value),
                                                ),
                                              ),
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <span className="status-badge">
                                  {p.stock ? "Disponible" : "Agotado"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <div className="two-columns">
                    <div className="white-card">
                      <div className="section-title">
                        <Heading level={3}>Comercios del ecosistema</Heading>
                        <Button
                          className="text-link"
                          onClick={() => setModal("new-shop")}
                        >
                          <Plus size={16} />
                          Registrar
                        </Button>
                      </div>
                      {allShops.map((s) => (
                        <div className="admin-shop-row" key={s.id}>
                          <img src={s.image} alt="" />
                          <div>
                            <strong>{s.name}</strong>
                            <small>
                              {s.category} · {s.floor}
                            </small>
                          </div>
                          <span className="status-badge">Activo</span>
                        </div>
                      ))}
                    </div>
                    <div className="admin-side">
                      <div className="white-card">
                        <Heading level={3}>Reglas de fidelización</Heading>
                        <p>
                          Equivalencia para nuevas compras. Los puntos
                          existentes no cambian.
                        </p>
                        <label className="field-label">
                          Puntos por Bs 1
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={equivalence}
                            onChange={(e) =>
                              setEquivalence(
                                Math.min(
                                  10,
                                  Math.max(
                                    1,
                                    Math.floor(Number(e.target.value)),
                                  ),
                                ),
                              )
                            }
                          />
                        </label>
                        <p className="small muted">
                          Recompensas: 300, 500 y 1.000 puntos · Niveles Bronce
                          a Platinum.
                        </p>
                        <Button
                          className="outline"
                          onClick={() => {
                            go("Paseo Points");
                          }}
                        >
                          Ver catálogo de recompensas
                          <ArrowRight size={15} />
                        </Button>
                      </div>
                      <div className="white-card">
                        <div className="section-title">
                          <Heading level={3}>Promociones</Heading>
                          <Button
                            className="icon-button"
                            aria-label="Nueva promoción"
                            onClick={() => setModal("promo")}
                          >
                            <Plus size={20} />
                          </Button>
                        </div>
                        {promos.map((p) => (
                          <div className="promo-row" key={p}>
                            <Gift size={17} />
                            <span>{p}</span>
                            <Button
                              className="icon-button"
                              aria-label={`Eliminar ${p}`}
                              onClick={() =>
                                setPromos((prev) =>
                                  prev.filter((x) => x !== p),
                                )
                              }
                            >
                              <X size={15} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="white-card">
                        <Heading level={3}>Usuarios y operaciones</Heading>
                        <div className="movement">
                          <span className="avatar">
                            {profile.name.charAt(0)}
                          </span>
                          <div>
                            <strong>{profile.name}</strong>
                            <small>{profile.email}</small>
                          </div>
                          <span className="gold-badge">Oro</span>
                        </div>
                        <div className="mini-note">
                          <ShieldCheck size={18} />
                          {orders.filter((o) => o.total > 5000).length
                            ? `${orders.filter((o) => o.total > 5000).length} pedidos superiores a Bs 5.000 requieren revisión.`
                            : "Sin alertas de importe elevado en la demo."}
                        </div>
                        <p className="small muted">
                          Revisión ilustrativa, no es un motor antifraude.
                        </p>
                      </div>
                      <div className="white-card">
                        <Heading level={3}>Conocimiento de Jarvis</Heading>
                        <p>
                          {allShops.length} comercios · {products.length}{" "}
                          productos · {events.length} eventos · {promos.length}{" "}
                          promociones
                        </p>
                        <p className="small muted">
                          El asistente consulta este catálogo local. La
                          evolución contempla IA, RAG, permisos, analítica y
                          datos verificados.
                        </p>
                        <Button
                          className="text-link"
                          onClick={() => setModal("project")}
                        >
                          Ver arquitectura y alcance
                          <ArrowRight size={15} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <footer className="footer">
            <span>
              Paseo Aranjuez<span className="footer-dot">·</span>Un lugar. Mil
              experiencias.
            </span>
            <div>
              <Button onClick={() => setModal("contact")}>Contacto</Button>
              <Button onClick={() => setModal("project")}>
                Sobre el proyecto
              </Button>
              <span className="demo-label">PROTOTIPO INTERACTIVO</span>
            </div>
          </footer>
        </main>
      </div>

      {page !== "Jarvis Paseo" && (
        <Button
          className="floating-jarvis"
          onClick={() => go("Jarvis Paseo")}
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
