/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
// Slumpade sprites för icke-svampar
const assetUrl = (path) => new URL(path, import.meta.url).href;

const plantSprites = [
    assetUrl("../bilder/sprite/plant/daffodil_sprite.png"),
    assetUrl("../bilder/sprite/plant/manchineel_sprite.png"),
    assetUrl("../bilder/sprite/plant/oleander_sprite.png"),
    assetUrl("../bilder/sprite/plant/poisonIvy_sprite.png")
];

// Växttyper som alltid ska ha svampsprite
const mushroomTypes = new Set([
    "giftigklockhatt",
    "gifttrattskivling",
    "lomskflugsvamp",
    "olivgultofsskivling",
    "rodflugsvamp",
    "stenmurkla",
    "vitflugsvamp",
    "angschampinjon",
    "foranderligtofsskivling",
    "kejsarflugsvamp",
    "mjolskivling",
    "ostronmussling",
    "rishalmsskivling",
    "toppmurkla"
]);

const mushroomSprite = assetUrl("../bilder/sprite/mushroom/mushroom_sprite.png");

// Databas för växttyper som används vid spawn och i popup
const plantTypes = {
    aktastormhatt: {
        name: "Äkta stormhatt",
        poisonous: true,
        info: "Äkta stormhatt (Aconitum napellus) är en mycket giftig perenn. Giftet akonitin finns särskilt i frön och rot och kan ge allvarliga förgiftningar. Symtom kan komma snabbt med brännande känsla i mun/svalg, magbesvär och påverkan på hjärta och muskler. Rör eller smaka aldrig på växten.",
        latin: "Aconitum napellus",
        photo: assetUrl("../bilder/giftig/aktastormhatt.png")
    },
    angschampinjon: {
        name: "Ängschampinjon",
        poisonous: false,
        info: "Ängschampinjon (Agaricus campestris) är en ätlig matsvamp som är allmänt förekommande i Sverige. Den växer på öppna marker som ängar, hagar och gräsmattor, ofta i ringar. Smaken är mild och svampen används i till exempel soppor och stuvningar.",
        latin: "Agaricus campestris",
        photo: assetUrl("../bilder/ickegiftig/angschampinjon.png")
    },
    aralia: {
        name: "Aralia",
        poisonous: false,
        info: "Aralia (Fatsia japonica) kommer ursprungligen från Japan. Den är vanlig som krukväxt i Sverige och blir ofta en ungefär meterhög buske med stora, lönnliknande blad. I sin naturliga miljö kan den bli betydligt större. Den trivs i ljusa rum men klarar också halvskugga.",
        latin: "Fatsia japonica",
        photo: assetUrl("../bilder/ickegiftig/aralia.png")
    },
    belladonna: {
        name: "Belladonna",
        poisonous: true,
        info: "Belladonna (Atropa belladonna) är mycket giftig och innehåller atropin. Den är sällsynt i Sverige och finns nästan bara i botaniska trädgårdar. Förgiftning kan ge muntorrhet, yrsel, hjärtklappning och synpåverkan, ibland även hallucinationer. Ät aldrig delar av växten eller bären.",
        latin: "Atropa belladonna",
        photo: assetUrl("../bilder/giftig/belladonna.png")
    },
    blabarstry: {
        name: "Blåbärstry",
        poisonous: false,
        info: "Blåbärstry (Lonicera caerulea var. kamtschatica) är en tålig bärbuske som ger ätliga blå bär med smak som liknar blåbär. Busken är lättodlad och klarar kallt klimat. Den odlas ofta i trädgårdar och finns i många sorter. Bären äts färska eller används i sylt och bakning.",
        latin: "Lonicera caerulea var. kamtschatica",
        photo: assetUrl("../bilder/ickegiftig/blabarstry.png")
    },
    fingerborgsblomma: {
        name: "Fingerborgsblomma",
        poisonous: true,
        info: "Fingerborgsblomma (Digitalis purpurea) är mycket giftig att äta. Den innehåller digitalisämnen som påverkar hjärtat. Symtom kan komma efter flera timmar och ge illamående, kräkningar, trötthet och hjärtrytmrubbningar. Det är inte farligt att ta i växten, men man ska aldrig smaka.",
        latin: "Digitalis purpurea",
        photo: assetUrl("../bilder/giftig/fingerborgsblomma.png")
    },
    foranderligtofsskivling: {
        name: "Föränderlig tofsskivling",
        poisonous: false,
        info: "Föränderlig tofsskivling (Kuehneromyces mutabilis) växer i tuvor på död ved, särskilt lövträdsstubbar. Den är ätlig men kan förväxlas med den dödligt giftiga giftig klockhatt, därför bör bara experter plocka den. Hatten skiftar färg beroende på fukt. Svampen hittas ofta från vår till höst.",
        latin: "Kuehneromyces mutabilis",
        photo: assetUrl("../bilder/ickegiftig/foranderligtofsskivling.png")
    },
    giftigklockhatt: {
        name: "Giftig klockhatt",
        poisonous: true,
        info: "Giftig klockhatt (Galerina marginata) är en liten brun svamp som ofta växer på ruttnande ved. Den är mycket giftig och innehåller amatoxiner, samma giftgrupp som hos vit flugsvamp. Förgiftning kan ge svåra magbesvär och allvarlig leverskada. Ät aldrig svampen.",
        latin: "Galerina marginata",
        photo: assetUrl("../bilder/giftig/giftigklockhatt.png")
    },
    gifttrattskivling: {
        name: "Gifttrattskivling",
        poisonous: true,
        info: "Gifttrattskivling (Clitocybe rivulosa) är en giftig svamp i släktet trattskivlingar. Den förekommer i Sverige och räknas som dödligt giftig. Svampen har en trattlik form när den blir äldre och kan växa i gräsmarker. Ät den aldrig.",
        latin: "Clitocybe rivulosa",
        photo: assetUrl("../bilder/giftig/gifttrattskivling.png")
    },
    kejsarflugsvamp: {
        name: "Kejsarflugsvamp",
        poisonous: false,
        info: "Kejsarflugsvamp (Amanita caesarea) är en matsvamp som ursprungligen kommer från Medelhavsområdet. Den känns igen på sin orangeröda hatt och gula skivor och fot. Svampen var uppskattad redan under romartiden och säljs som matsvamp i delar av Sydeuropa. Oerfarna kan dock förväxla den med giftiga flugsvampar.",
        latin: "Amanita caesarea",
        photo: assetUrl("../bilder/ickegiftig/kejsarflugsvamp.png")
    },
    klattersummak: {
        name: "Klättersumak",
        poisonous: true,
        info: "Klättersumak (Toxicodendron radicans) är en klätterväxt i familjen sumakväxter. Den kan ge svår allergisk kontaktdermatit hos känsliga personer. Arten är vanlig i USA och kallas där ”poison ivy”. Undvik att röra växten och tvätta huden om du får växtsaft på dig.",
        latin: "Toxicodendron radicans",
        photo: assetUrl("../bilder/giftig/klattersummak.png")
    },
    kristuspalmen: {
        name: "Kristuspalmen",
        poisonous: true,
        info: "Kristuspalmen (Ricinus communis) är en prydnadsväxt vars frön innehåller det mycket giftiga proteinet ricin. Ett söndertuggat frö kan ge allvarlig förgiftning. Symtom kan vara kraftiga magbesvär och vätskeförlust. Ricinolja är ofarlig, men fröna ska aldrig ätas.",
        latin: "Ricinus communis",
        photo: assetUrl("../bilder/giftig/kristuspalmen.png")
    },
    kungsljus: {
        name: "Kungsljus",
        poisonous: false,
        info: "Kungsljus (Verbascum thapsus) är en tvåårig ört. Första året bildas bara blad, andra året växer en rak stjälk som kan bli upp till omkring 2 meter. Den blommar vanligtvis juni–augusti med en gul blomspira. Trivs i soliga och torra lägen.",
        latin: "Verbascum thapsus",
        photo: assetUrl("../bilder/ickegiftig/kungsljus.png")
    },
    lomskflugsvamp: {
        name: "Lömsk flugsvamp",
        poisonous: true,
        info: "Lömsk flugsvamp (Amanita phalloides) är mycket giftig och innehåller amatoxin. Symtomen kommer ofta först efter 8–24 timmar med kraftiga diarréer och kräkningar, och senare kan leverskador uppstå. Förgiftningen kan vara livshotande även vid små mängder. Ät aldrig denna svamp.",
        latin: "Amanita phalloides",
        photo: assetUrl("../bilder/giftig/lomskflugsvamp.png")
    },
    mjolskivling: {
        name: "Mjölskivling",
        poisonous: false,
        info: "Mjölskivling (Clitopilus prunulus) är en matnyttig svamp som ofta hittas på hösten. Den växer i öppen löv- och blandskog men också i parker och på gräsmattor. Svampen har en tydlig mjölaktig doft och ger rosa sporpulver. Den kan förväxlas med giftiga trattsskivlingar, så artbestämning är viktig.",
        latin: "Clitopilus prunulus",
        photo: assetUrl("../bilder/ickegiftig/mjolskivling.png")
    },
    odort: {
        name: "Odört",
        poisonous: true,
        info: "Odört (Conium maculatum) är mycket giftig och innehåller koniin. Smaken är obehaglig, men förväxling med ätliga växter har förekommit. Symtom kan komma snabbt med salivavsöndring, kräkningar och törst, och i svåra fall tal- och sväljsvårigheter. Undvik helt att smaka.",
        latin: "Conium maculatum",
        photo: assetUrl("../bilder/giftig/odort.png")
    },
    olivgultofsskivling: {
        name: "Olivgul tofsskivling",
        poisonous: true,
        info: "Olivgul tofsskivling (Pholiota adiposa) är en gulbrun, fjällig svamp som ofta växer i klungor på död ved. Den finns i Europa, Asien och Nordamerika och fruktar sensommar till höst. Arten är svår att skilja från närbesläktade tofsskivlingar. Ät den inte om du inte är expert.",
        latin: "Pholiota adiposa",
        photo: assetUrl("../bilder/giftig/olivgultofsskivling.png")
    },
    ostronmussling: {
        name: "Ostronmussling",
        poisonous: false,
        info: "Ostronmussling (Pleurotus ostreatus) är en vanlig matsvamp. Den växer på multnande trädstammar och är en nedbrytare (saprofyt), men odlas också kommersiellt. Hatten är ofta gråblå till gråbrun och växtsättet ger en ostronlik form.",
        latin: "Pleurotus ostreatus",
        photo: assetUrl("../bilder/ickegiftig/ostronmussling.png")
    },
    ramslok: {
        name: "Ramslök",
        poisonous: false,
        info: "Ramslök (Allium ursinum) är en ganska sällsynt växt som trivs i lundar och lövängar. Den känns igen på stark lökdoft och på vita stjärnliknande blommor. Bladen används som krydda och smakar som vitlök, men det är bladen – inte löken – som brukar ätas.",
        latin: "Allium ursinum",
        photo: assetUrl("../bilder/ickegiftig/ramslok.png")
    },
    rishalmsskivling: {
        name: "Rishalmsskivling",
        poisonous: false,
        info: "Rishalmsskivling (Volvopluteus gloiocephalus, tidigare Volvariella speciosa) är en saprotrof som växer i gräsmarker, trädgårdar och kompost. Skivorna är först vita och blir rosa med åldern, och foten har en säcklik volva. Den räknas som ätlig men av låg kvalitet. Unga exemplar kan förväxlas med giftiga flugsvampar.",
        latin: "Volvopluteus gloiocephalus",
        photo: assetUrl("../bilder/ickegiftig/rishalmsskivling.png")
    },
    rodflugsvamp: {
        name: "Röd flugsvamp",
        poisonous: true,
        info: "Röd flugsvamp (Amanita muscaria) är lätt att känna igen med röd hatt och vita vårtor. Den är måttligt giftig och kan ge symtom som illamående, svettningar, yrsel och hallucinationer. Dödsfall är mycket sällsynta, men förgiftning kan ändå vara allvarlig. Svampen ska inte ätas.",
        latin: "Amanita muscaria",
        photo: assetUrl("../bilder/giftig/rodflugsvamp.png")
    },
    svartnattskatta: {
        name: "Svart nattskatta",
        poisonous: false,
        info: "Svart nattskatta (Solanum nigrum) är en ettårig ört. I Skandinavien hittas den mest på odlade platser som gårdar och trädgårdar. Den har små vita blommor och runda, svarta bär. Omogna bär och gröna delar innehåller solanin och är giftiga, medan mogna bär innehåller mycket mindre.",
        latin: "Solanum nigrum",
        photo: assetUrl("../bilder/ickegiftig/svartnattskatta.png")
    },
    stenmurkla: {
        name: "Stenmurkla",
        poisonous: true,
        info: "Stenmurkla (Gyromitra esculenta) är giftig som rå eller otillräckligt tillagad. Den innehåller gyromitrin som kan ge magbesvär och i värsta fall skada levern. Symtom börjar ofta 4–12 timmar efter förtäring. Svampen kan förväxlas med toppmurkla och biskopsmössa.",
        latin: "Gyromitra esculenta",
        photo: assetUrl("../bilder/giftig/stenmurkla.png")
    },
    tibast: {
        name: "Tibast",
        poisonous: true,
        info: "Tibast (Daphne mezereum) är en giftig buske med mycket irriterande bark och bär. Ämnena daphnetoxin och mezerein kan ge brännande känsla i mun och svalg samt magbesvär. Växtsaften kan även irritera hud och ögon. Plocka aldrig bären.",
        latin: "Daphne mezereum",
        photo: assetUrl("../bilder/giftig/tibast.png")
    },
    tidlosan: {
        name: "Tidlösa",
        poisonous: true,
        info: "Tidlösa (Colchicum autumnale) är en mycket giftig knölväxt. Giftet colchicin påverkar celldelningen och kan skada magtarmkanal och nervsystem. Den blommar ofta på hösten när bladen redan vissnat. Växten finns odlad och kan ibland förvildas i Sverige.",
        latin: "Colchicum autumnale",
        photo: assetUrl("../bilder/giftig/tidlosan.png")
    },
    toppmurkla: {
        name: "Toppmurkla",
        poisonous: false,
        info: "Toppmurkla (Verpa bohemica) fruktar tidigt på våren efter snösmältning i skog. Den räknas som ätlig men inte rekommenderad och kan ge magbesvär om den tillagas fel. Hatten är veckad och sitter fritt från foten, vilket skiljer den från äkta murklor. Den växer på marken i skogsmiljö.",
        latin: "Verpa bohemica",
        photo: assetUrl("../bilder/ickegiftig/toppmurkla.png")
    },
    tradgardsriddarsporre: {
        name: "Trädgårdsriddarsporre",
        poisonous: false,
        info: "Trädgårdsriddarsporre (Delphinium-hybrider) är en populär prydnadsväxt i trädgårdar. Den har höga blomspiror med många blommor, ofta i blå, lila, rosa eller vita nyanser. Växterna kan bli mycket höga, ibland upp mot 2 meter. De blommar under sommaren och lockar pollinerare.",
        latin: "Delphinium-hybrider",
        photo: assetUrl("../bilder/ickegiftig/tradgardsriddarsporre.png")
    },
    vildmorot: {
        name: "Vildmorot",
        poisonous: false,
        info: "Vildmorot (Daucus carota) är en tvåårig växt i morotssläktet. Den har en tunn, träig pålrot som ändå är ätlig. Arten förekommer naturligt i Eurasien och Nordafrika och har spridits till andra delar av världen. Den odlade moroten är en underart till vildmoroten.",
        latin: "Daucus carota",
        photo: assetUrl("../bilder/ickegiftig/vildmorot.png")
    },
    vildvin: {
        name: "Vildvin",
        poisonous: false,
        info: "Vildvin (Parthenocissus quinquefolia), även kallad klättervildvin, kommer från Nordamerika. Den klättrar med sugkoppar och kan nå 20–30 meter. Bären är lila‑svarta och innehåller oxalsyra som är giftig för människor, men fåglar äter dem. Växtsaften kan irritera huden.",
        latin: "Parthenocissus quinquefolia",
        photo: assetUrl("../bilder/ickegiftig/vildvin.png")
    },
    vitflugsvamp: {
        name: "Vit flugsvamp",
        poisonous: true,
        info: "Vit flugsvamp (Amanita virosa) är mycket giftig och innehåller amatoxin som skadar lever och tarmslemhinna. Symtom kommer ofta efter 8–24 timmar med vattentunna diarréer och kräkningar, följt av leverskador. Förgiftningen kan vara livshotande. Lämna alltid vita flugsvampar ifred.",
        latin: "Amanita virosa",
        photo: assetUrl("../bilder/giftig/vitflugsvamp.png")
    }
};

export default class Plant {
    constructor(x, y, typeKey) {
        this.x = x;
        this.y = y;

        // Koppla instansen till sin typdata
        this.type = plantTypes[typeKey];

        this.width = 48;
        this.height = 48;

        this.collected = false;

        // Världssprite (antingen svamp eller slumpad växt)
        this.sprite = new Image();
        this.sprite.src = mushroomTypes.has(typeKey)
            ? mushroomSprite
            : plantSprites[Math.floor(Math.random() * plantSprites.length)];

        // Fullbild som visas i popup-fönstret
        this.photo = new Image();
        this.photo.src = this.type.photo;
    }

    draw(ctx, cameraX, cameraY) {
        if (this.collected) return;

        // Ingen crash om bilden inte laddas upp
        if (!this.sprite.complete || this.sprite.naturalWidth === 0) return;

        ctx.drawImage(
            this.sprite,
            this.x - cameraX,
            this.y - cameraY,
            this.width,
            this.height
        );
    }

    collect() {
        this.collected = true;
    }
}
export { plantTypes };
