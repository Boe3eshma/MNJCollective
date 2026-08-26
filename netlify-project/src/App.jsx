import { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import {
  ShoppingCart, Search, X, Plus, Minus, ChevronRight, ChevronDown, Check,
  Package, Clock, Truck, Lock, ImageOff, Trash2, Pencil, Eye, EyeOff,
  LogOut, AlertTriangle, Mail, ArrowLeft, Layers, Globe, Upload,
  ShieldCheck, Info, Loader2, CheckCircle2, FileText, Cookie,
  ClipboardList, Boxes, Send, RefreshCw
} from "lucide-react";

/* ============================================================================
   VERTALINGEN / TRANSLATIONS / ÜBERSETZUNGEN
   ----------------------------------------------------------------------------
   Alle UI-tekst loopt via de t() functie (zie useT hieronder). Nederlands is
   de bronwaarde; ontbrekende sleutels in DE/EN vallen automatisch terug op NL.
   Productnamen/-beschrijvingen zijn los hiervan optioneel per taal in te
   vullen via het admin-productformulier (zie resolveProductField()).
   ========================================================================= */

const TRANSLATIONS = {
  nl: {
    // Navigatie
    nav_home: "Home",
    nav_products: "Producten",
    nav_cart: "Winkelmand",
    lang_label: "Taal",
    loading_generic: "Laden...",

    // Hero / home
    hero_eyebrow: "Community bestelcatalogus",
    hero_title: "Pokémon, One Piece, Lorcana & Dragon Ball — besteld via de community die het snapt.",
    hero_lead:
      "Blader door de catalogus en plaats een bestelverzoek — geen account, geen online betaling. We nemen daarna persoonlijk contact met je op over beschikbaarheid en verzending.",
    hero_cta_catalog: "Bekijk alle producten",
    hero_cta_cart: "Naar winkelmand",
    status_stock_card_title: "🟢 OP VOORRAAD",
    status_stock_card_desc: "Direct beschikbaar. Deze producten liggen fysiek klaar bij ons.",
    status_preorder_card_title: "🟡 PRE-ORDER",
    status_preorder_card_desc: "Nog niet uitgekomen, maar alvast te reserveren. Verwachte datum staat bij het product.",
    status_ondemand_card_title: "🔵 ON-DEMAND",
    status_ondemand_card_desc: "Wordt speciaal voor jou besteld bij onze leverancier na je bestelverzoek.",
    home_featured_title: "Uitgelicht",
    home_view_all: "Alle producten",
    home_categories_title: "Categorieën",

    // Status badges (kort/algemeen gebruik)
    status_in_stock_badge: "OP VOORRAAD",
    status_preorder_badge: "PRE-ORDER",
    status_on_demand_badge: "ON-DEMAND",
    status_in_stock_short: "Op voorraad",
    status_preorder_short: "Pre-order",
    status_on_demand_short: "On-demand",

    // Levertijd-uitleg
    delivery_explainer_full:
      "Niet alle producten zijn direct uit voorraad leverbaar. Sommige producten zijn beschikbaar als pre-order of worden on-demand besteld. Bij deze producten kan de levertijd variëren van enkele weken tot enkele maanden, afhankelijk van onder andere bestelvolume, releasedata, beschikbaarheid bij leveranciers en transport.",
    delivery_explainer_compact:
      "Levertijden kunnen variëren van enkele weken tot enkele maanden bij pre-order en on-demand producten.",

    // Productkaart
    card_view_product: "Bekijk product",
    card_quick_add: "Direct toevoegen aan winkelmand",

    // Catalogus
    catalog_title: "Alle producten",
    catalog_search_placeholder: "Zoek op naam of beschrijving...",
    catalog_filter_all: "Alle",
    catalog_filter_all_status: "Alle statussen",
    catalog_empty_title: "Geen producten gevonden",
    catalog_empty_text: "Probeer een andere zoekterm of pas de filters aan.",

    // Productpagina
    product_back_to_catalog: "Terug naar producten",
    product_not_found_title: "Product niet gevonden",
    product_not_found_text: "Dit product bestaat niet (meer) of is niet meer zichtbaar.",
    product_back_to_all: "Naar alle producten",
    product_in_stock_notice: "Dit product is direct op voorraad.",
    product_longlead_title: "Langere levertijd van toepassing.",
    product_longlead_body: "Dit product is {status} en kan een levertijd hebben van enkele weken tot enkele maanden.",
    product_add_to_cart: "In winkelmand",
    product_added: "Toegevoegd ✓",

    // Winkelmand
    cart_title: "Winkelmand",
    cart_empty_title: "Je winkelmand is leeg",
    cart_empty_text: "Blader door de catalogus en voeg producten toe om een bestelverzoek te plaatsen.",
    cart_browse: "Bekijk producten",
    cart_warning:
      "Let op: je winkelmand bevat één of meerdere pre-order- of on-demand producten. Deze kunnen een levertijd hebben van enkele weken tot enkele maanden. Bevat je bestelling meerdere producten, dan bepaalt het product met de langste levertijd wanneer het geheel verzendklaar is.",
    cart_item_count: "Aantal producten",
    cart_total: "Totaal (indicatief)",
    cart_no_payment_note: "Dit bedrag wordt niet via deze website in rekening gebracht. Er vindt geen online betaling plaats.",
    cart_continue_shopping: "Verder winkelen",
    cart_place_order: "Bestelling plaatsen",

    // Checkout
    checkout_back_to_cart: "Terug naar winkelmand",
    checkout_title: "Bestelgegevens",
    checkout_subtitle: "Dit is een bestelverzoek — er wordt geen betaling verwerkt. We nemen na ontvangst contact met je op.",
    checkout_longlead_warning:
      "Je bestelling bevat pre-order- en/of on-demand producten. Houd rekening met een levertijd van enkele weken tot enkele maanden voordat je je bestelverzoek verstuurt.",
    field_name: "Naam",
    field_name_placeholder: "Voor- en achternaam",
    field_address: "Adres",
    field_address_placeholder: "Straat en huisnummer",
    field_postal: "Postcode",
    field_city: "Plaats",
    field_country: "Land",
    field_phone: "Telefoonnummer",
    field_phone_placeholder: "6 12345678",
    field_phone_hint: "Vul je nummer in zonder landcode, bv. 612345678.",
    field_email: "E-mailadres",
    field_email_placeholder: "jij@voorbeeld.nl",
    field_note: "Opmerking bij bestelling (optioneel)",
    field_note_placeholder: "Bijv. gewenste afhaal- of verzendvoorkeur",
    checkout_summary_title: "Samenvatting",
    checkout_consent_pre: "Ik ga akkoord met de",
    checkout_terms_link: "algemene voorwaarden",
    checkout_and: "en",
    checkout_privacy_link: "privacyverklaring",
    checkout_consent_post:
      ". Ik begrijp dat dit een bestelverzoek is zonder betaling en zonder gegarandeerde directe levering.",
    checkout_submitting: "Bezig met versturen...",
    checkout_submit: "Bestelverzoek versturen",
    checkout_submit_note: "Dit is een bestelverzoek, geen betaling. Er wordt geen bedrag afgeschreven.",
    checkout_error_generic: "Er ging iets mis bij het opslaan van je bestelling. Probeer het opnieuw of neem contact op via {email}.",

    // Validatie
    err_name: "Naam is verplicht.",
    err_address: "Adres is verplicht.",
    err_postal: "Postcode is verplicht.",
    err_city: "Plaats is verplicht.",
    err_country: "Land is verplicht.",
    err_phone_required: "Telefoonnummer is verplicht.",
    err_phone_invalid: "Vul een geldig telefoonnummer in.",
    err_email_required: "E-mailadres is verplicht.",
    err_email_invalid: "Vul een geldig e-mailadres in.",
    err_consent: "Je moet akkoord gaan om je bestelverzoek te versturen.",

    // Bevestiging
    confirm_title: "Bedankt voor je bestelverzoek!",
    confirm_received: "Je bestelling is goed ontvangen. We nemen deze in behandeling en nemen indien nodig contact met je op.",
    confirm_longlead:
      "Eén of meerdere producten in je bestelling zijn pre-order of on-demand. Hiervoor geldt een levertijd van enkele weken tot enkele maanden.",
    confirm_items_title: "Bestelde producten",
    confirm_details_title: "Jouw gegevens",
    confirm_no_payment:
      "Dit is een bestelverzoek, geen betaling. Er is geen bedrag afgeschreven — we nemen contact met je op over de verdere afhandeling.",
    confirm_email_fallback_pre: "Wil je zeker weten dat we je bestelling ontvangen?",
    confirm_email_fallback_link: "Verstuur de gegevens ook per e-mail",
    confirm_not_found_title: "Geen bestelling gevonden",
    confirm_not_found_text: "Er is geen recente bestelling om te tonen.",
    confirm_continue_shopping: "Verder winkelen",
    confirm_home: "Naar home",

    // Juridisch
    legal_draft_warning_title: "Conceptversie.",
    legal_draft_warning_text: "Deze tekst is een startpunt en moet vóór livegang juridisch gecontroleerd worden (o.a. AVG/GDPR-conformiteit).",

    privacy_title: "Privacybeleid",
    privacy_h_data: "Welke gegevens verzamelen we?",
    privacy_p_data: "Bij het plaatsen van een bestelverzoek vragen we om je naam, adres, postcode, plaats, land, telefoonnummer (met landcode) en e-mailadres, en eventueel een opmerking bij je bestelling.",
    privacy_h_why: "Waarom verzamelen we deze gegevens?",
    privacy_p_why: "We gebruiken deze gegevens uitsluitend om je bestelverzoek te kunnen verwerken, contact met je op te nemen over beschikbaarheid en levertijd, en de bestelling verder af te handelen.",
    privacy_h_retention: "Bewaartermijn",
    privacy_p_retention: "We bewaren je gegevens zolang dat nodig is voor de afhandeling van je bestelling en eventuele wettelijke (fiscale) bewaarplicht.",
    privacy_h_sharing: "Delen met derden",
    privacy_p_sharing: "We delen je gegevens niet met derden, behalve wanneer dat noodzakelijk is voor de levering van je bestelling (bijvoorbeeld een verzendpartij), en alleen met de gegevens die daarvoor nodig zijn.",
    privacy_h_rights: "Jouw rechten",
    privacy_p_rights: "Je hebt recht op inzage, correctie en verwijdering van je gegevens, en het recht om bezwaar te maken tegen de verwerking ervan. Neem hiervoor contact op via {email}.",
    privacy_h_security: "Beveiliging",
    privacy_p_security: "We nemen passende maatregelen om je gegevens te beschermen tegen verlies of onbevoegde toegang. Deze eerste versie van de bestelapplicatie draait binnen een artifact-omgeving zonder eigen serverinfrastructuur; voordat er op grote schaal persoonsgegevens via deze applicatie worden verwerkt, raden we een migratie naar een eigen beveiligde omgeving aan.",
    privacy_h_contact: "Contact",
    privacy_p_contact: "Vragen over dit privacybeleid? Mail naar {email}.",

    terms_title: "Algemene voorwaarden",
    terms_h1: "1. Toepasselijkheid",
    terms_p1: "Deze voorwaarden zijn van toepassing op elk bestelverzoek dat via deze website wordt geplaatst bij {shop}.",
    terms_h2: "2. Bestelverzoeken",
    terms_p2: "Een bestelling via deze website is een bestelverzoek, geen koopovereenkomst en geen betaalverplichting via de website. {shop} neemt na ontvangst contact op ter bevestiging en verdere afhandeling.",
    terms_h3: "3. Prijzen",
    terms_p3: "Vermelde prijzen zijn indicatief en onder voorbehoud van beschikbaarheid en eventuele prijswijzigingen bij leveranciers.",
    terms_h4: "4. Levering",
    terms_p4: "Levertijden variëren per product. Producten die als pre-order of on-demand zijn aangemerkt kunnen een levertijd hebben van enkele weken tot enkele maanden. Genoemde releasedata zijn indicatief.",
    terms_h5: "5. Betaling",
    terms_p5: "Betaling vindt plaats buiten deze website, in onderling overleg na bevestiging van je bestelverzoek.",
    terms_h6: "6. Annulering",
    terms_p6: "Je kunt een bestelverzoek annuleren door contact op te nemen via {email}, bij voorkeur zo snel mogelijk na het plaatsen van het verzoek.",
    terms_h7: "7. Aansprakelijkheid",
    terms_p7: "{shop} spant zich in om bestelverzoeken zorgvuldig te verwerken, maar is niet aansprakelijk voor vertragingen die buiten haar invloed liggen, zoals vertraging bij leveranciers.",
    terms_h8: "8. Contact",
    terms_p8: "Vragen? Mail naar {email}.",

    cookies_title: "Cookiebeleid",
    cookies_h_none: "Geen trackingcookies",
    cookies_p_none: "Deze website gebruikt geen tracking- of advertentiecookies.",
    cookies_h_functional: "Functionele opslag",
    cookies_p_functional: "Om de catalogus en bestellingen te kunnen tonen en verwerken, wordt de benodigde data (producten en bestelgegevens) opgeslagen. Dit gebeurt uitsluitend om de webshopfunctionaliteit te laten werken, niet voor tracking of advertentiedoeleinden.",
    cookies_h_contact: "Contact",
    cookies_p_contact: "Vragen over dit cookiebeleid? Mail naar {email}.",

    // Footer
    footer_tagline: "Community-catalogus voor Pokémon, One Piece, Lorcana en Dragon Ball TCG. Bestelverzoeken worden persoonlijk door ons behandeld — geen webshop, geen online betaling.",
    footer_shop_heading: "Shop",
    footer_info_heading: "Informatie",
    footer_bottom_note: "© {year} MNJCollective — bestelverzoeken zijn geen betalingen.",
    footer_admin_link: "Beheer",

    // Admin — login
    admin_login_title: "Beheeromgeving",
    admin_login_subtitle: "Voer de toegangscode in om producten en bestellingen te beheren.",
    admin_login_placeholder: "Toegangscode",
    admin_login_error: "Onjuiste toegangscode.",
    admin_login_button: "Inloggen",
    admin_back_to_site: "Terug naar website",

    // Admin — shell
    admin_header_title: "MNJCollective — Beheer",
    admin_view_site: "Bekijk website",
    admin_logout: "Uitloggen",
    admin_tab_products: "Producten",
    admin_tab_orders: "Bestellingen",
    admin_tab_invite: "Uitnodigen",
    invite_title: "Klant uitnodigen via WhatsApp",
    invite_subtitle: "Vul een telefoonnummer in en genereer een kant-en-klare WhatsApp-uitnodiging met link naar de shop.",
    invite_field_name: "Naam (optioneel)",
    invite_field_name_placeholder: "Bijv. Sanne",
    invite_field_phone: "Telefoonnummer",
    invite_field_shop_url: "Link naar je shop",
    invite_field_shop_url_placeholder: "https://tcghaven.nl",
    invite_message_label: "Berichttekst",
    invite_generate: "WhatsApp-link openen",
    invite_copy: "Link kopiëren",
    invite_copied: "Gekopieerd ✓",
    invite_default_message: "Hoi{name}! Je bent uitgenodigd om te bestellen bij MNJCollective — bekijk de catalogus en plaats je bestelverzoek via {url}",

    // Admin — producten
    admin_products_heading: "Producten ({count})",
    admin_new_product: "Nieuw product",
    admin_no_products_title: "Nog geen producten",
    admin_no_products_text: "Voeg je eerste product toe om de catalogus te vullen.",
    admin_hidden_suffix: "(verborgen)",
    admin_action_show: "Tonen",
    admin_action_hide: "Verbergen",
    admin_action_edit: "Bewerken",
    admin_action_delete: "Verwijderen",
    admin_delete_confirm: 'Weet je zeker dat je "{name}" wilt verwijderen?',

    // Admin — productformulier
    form_edit_title: "Product bewerken",
    form_new_title: "Nieuw product",
    form_field_name: "Productnaam",
    form_field_category: "Categorie",
    form_field_price: "Prijs (€)",
    form_field_short_desc: "Korte beschrijving",
    form_field_short_desc_placeholder: "Wordt getoond op de productkaart",
    form_field_full_desc: "Uitgebreide beschrijving",
    form_field_status: "Beschikbaarheidsstatus",
    form_status_in_stock: "🟢 Op voorraad",
    form_status_preorder: "🟡 Pre-order",
    form_status_on_demand: "🔵 On-demand",
    form_field_expected_date: "Verwachte release-/leverdatum",
    form_field_expected_date_placeholder: "Bijv. Verwacht: nov 2026",
    form_field_delivery_note: "Extra levertijd-opmerking",
    form_field_image_url: "Afbeeldings-URL",
    form_image_help: "Upload een eigen foto, of plak een directe link naar een afbeelding.",
    form_image_upload_btn: "Uploaden",
    form_image_uploading: "Bezig...",
    form_image_preview_fail: "Afbeelding kon niet geladen worden",
    form_image_preview_empty: "Nog geen afbeelding",
    form_field_visible: "Product zichtbaar op de website",
    form_error_required: "Naam, categorie en prijs zijn verplicht.",
    form_cancel: "Annuleren",
    form_save: "Product opslaan",
    form_translations_toggle: "Vertalingen toevoegen (optioneel)",
    form_translations_hint: "Leeg gelaten velden tonen automatisch de Nederlandse tekst aan bezoekers.",
    form_lang_section_en: "Engels",
    form_lang_section_de: "Duits",

    // Admin — bestellingen
    admin_orders_heading: "Bestellingen ({count})",
    admin_status_filter_all: "Alle",
    admin_refresh_label: "Vernieuwen",
    admin_orders_empty_title: "Geen bestellingen",
    admin_orders_empty_text: "Er zijn nog geen bestelverzoeken binnengekomen.",
    admin_orders_loading: "Bestellingen laden...",
    admin_email_sent: "verzonden",
    admin_email_check: "handmatig controleren",
    admin_detail_customer: "Klant",
    admin_detail_email: "E-mail",
    admin_detail_phone: "Telefoon",
    admin_detail_address: "Adres",
    admin_detail_note: "Opmerking",
    admin_detail_products: "Producten",
    admin_detail_total: "Totaal",

    // Bestelstatussen (codes)
    order_status_new: "Nieuw",
    order_status_processing: "In behandeling",
    order_status_ordered_supplier: "Besteld bij leverancier",
    order_status_ready: "Klaar voor verzending",
    order_status_shipped: "Verzonden",
    order_status_cancelled: "Geannuleerd",
  },

  de: {
    nav_home: "Start",
    nav_products: "Produkte",
    nav_cart: "Warenkorb",
    lang_label: "Sprache",
    loading_generic: "Wird geladen...",

    hero_eyebrow: "Community-Bestellkatalog",
    hero_title: "Pokémon, One Piece, Lorcana & Dragon Ball — bestellt über die Community, die es versteht.",
    hero_lead:
      "Stöbere im Katalog und stelle eine Bestellanfrage — kein Konto, keine Online-Zahlung. Wir melden uns danach persönlich bei dir zu Verfügbarkeit und Versand.",
    hero_cta_catalog: "Alle Produkte ansehen",
    hero_cta_cart: "Zum Warenkorb",
    status_stock_card_title: "🟢 AUF LAGER",
    status_stock_card_desc: "Sofort verfügbar. Diese Produkte liegen physisch bei uns bereit.",
    status_preorder_card_title: "🟡 VORBESTELLUNG",
    status_preorder_card_desc: "Noch nicht erschienen, aber bereits reservierbar. Das erwartete Datum steht beim Produkt.",
    status_ondemand_card_title: "🔵 AUF ANFRAGE",
    status_ondemand_card_desc: "Wird nach deiner Bestellanfrage speziell für dich bei unserem Lieferanten bestellt.",
    home_featured_title: "Empfohlen",
    home_view_all: "Alle Produkte",
    home_categories_title: "Kategorien",

    status_in_stock_badge: "AUF LAGER",
    status_preorder_badge: "VORBESTELLUNG",
    status_on_demand_badge: "AUF ANFRAGE",
    status_in_stock_short: "Auf Lager",
    status_preorder_short: "Vorbestellung",
    status_on_demand_short: "Auf Anfrage",

    delivery_explainer_full:
      "Nicht alle Produkte sind sofort aus dem Lager lieferbar. Manche Produkte sind als Vorbestellung verfügbar oder werden auf Anfrage bestellt. Bei diesen Produkten kann die Lieferzeit von einigen Wochen bis zu mehreren Monaten variieren, abhängig unter anderem vom Bestellvolumen, Erscheinungsdaten, Verfügbarkeit bei Lieferanten und Transport.",
    delivery_explainer_compact:
      "Bei Vorbestellungen und Produkten auf Anfrage kann die Lieferzeit von einigen Wochen bis zu mehreren Monaten variieren.",

    card_view_product: "Produkt ansehen",
    card_quick_add: "Direkt zum Warenkorb hinzufügen",

    catalog_title: "Alle Produkte",
    catalog_search_placeholder: "Suche nach Name oder Beschreibung...",
    catalog_filter_all: "Alle",
    catalog_filter_all_status: "Alle Status",
    catalog_empty_title: "Keine Produkte gefunden",
    catalog_empty_text: "Versuche einen anderen Suchbegriff oder passe die Filter an.",

    product_back_to_catalog: "Zurück zu den Produkten",
    product_not_found_title: "Produkt nicht gefunden",
    product_not_found_text: "Dieses Produkt existiert nicht (mehr) oder ist nicht mehr sichtbar.",
    product_back_to_all: "Zu allen Produkten",
    product_in_stock_notice: "Dieses Produkt ist sofort auf Lager.",
    product_longlead_title: "Längere Lieferzeit zu beachten.",
    product_longlead_body: "Dieses Produkt ist {status} und kann eine Lieferzeit von einigen Wochen bis zu mehreren Monaten haben.",
    product_add_to_cart: "In den Warenkorb",
    product_added: "Hinzugefügt ✓",

    cart_title: "Warenkorb",
    cart_empty_title: "Dein Warenkorb ist leer",
    cart_empty_text: "Stöbere im Katalog und füge Produkte hinzu, um eine Bestellanfrage zu stellen.",
    cart_browse: "Produkte ansehen",
    cart_warning:
      "Achtung: Dein Warenkorb enthält ein oder mehrere Produkte mit Vorbestellung oder auf Anfrage. Diese können eine Lieferzeit von einigen Wochen bis zu mehreren Monaten haben. Enthält deine Bestellung mehrere Produkte, bestimmt das Produkt mit der längsten Lieferzeit, wann das Gesamtpaket versandbereit ist.",
    cart_item_count: "Anzahl Produkte",
    cart_total: "Gesamt (unverbindlich)",
    cart_no_payment_note: "Dieser Betrag wird nicht über diese Website in Rechnung gestellt. Es findet keine Online-Zahlung statt.",
    cart_continue_shopping: "Weiter einkaufen",
    cart_place_order: "Bestellung aufgeben",

    checkout_back_to_cart: "Zurück zum Warenkorb",
    checkout_title: "Bestelldaten",
    checkout_subtitle: "Dies ist eine Bestellanfrage — es wird keine Zahlung verarbeitet. Wir melden uns nach Erhalt bei dir.",
    checkout_longlead_warning:
      "Deine Bestellung enthält Produkte mit Vorbestellung und/oder auf Anfrage. Rechne mit einer Lieferzeit von einigen Wochen bis zu mehreren Monaten, bevor du deine Bestellanfrage sendest.",
    field_name: "Name",
    field_name_placeholder: "Vor- und Nachname",
    field_address: "Adresse",
    field_address_placeholder: "Straße und Hausnummer",
    field_postal: "Postleitzahl",
    field_city: "Stadt",
    field_country: "Land",
    field_phone: "Telefonnummer",
    field_phone_placeholder: "6 12345678",
    field_phone_hint: "Gib deine Nummer ohne Landesvorwahl ein, z. B. 612345678.",
    field_email: "E-Mail-Adresse",
    field_email_placeholder: "du@beispiel.de",
    field_note: "Anmerkung zur Bestellung (optional)",
    field_note_placeholder: "Z. B. gewünschte Abhol- oder Versandpräferenz",
    checkout_summary_title: "Zusammenfassung",
    checkout_consent_pre: "Ich stimme den",
    checkout_terms_link: "Allgemeinen Geschäftsbedingungen",
    checkout_and: "und der",
    checkout_privacy_link: "Datenschutzerklärung",
    checkout_consent_post:
      " zu. Mir ist bewusst, dass dies eine Bestellanfrage ohne Zahlung und ohne garantierte sofortige Lieferung ist.",
    checkout_submitting: "Wird gesendet...",
    checkout_submit: "Bestellanfrage senden",
    checkout_submit_note: "Dies ist eine Bestellanfrage, keine Zahlung. Es wird kein Betrag abgebucht.",
    checkout_error_generic: "Beim Speichern deiner Bestellung ist etwas schiefgelaufen. Versuche es erneut oder kontaktiere uns über {email}.",

    err_name: "Name ist erforderlich.",
    err_address: "Adresse ist erforderlich.",
    err_postal: "Postleitzahl ist erforderlich.",
    err_city: "Stadt ist erforderlich.",
    err_country: "Land ist erforderlich.",
    err_phone_required: "Telefonnummer ist erforderlich.",
    err_phone_invalid: "Gib eine gültige Telefonnummer ein.",
    err_email_required: "E-Mail-Adresse ist erforderlich.",
    err_email_invalid: "Gib eine gültige E-Mail-Adresse ein.",
    err_consent: "Du musst zustimmen, um deine Bestellanfrage zu senden.",

    confirm_title: "Danke für deine Bestellanfrage!",
    confirm_received: "Deine Bestellung ist bei uns eingegangen. Wir bearbeiten sie und melden uns bei Bedarf bei dir.",
    confirm_longlead:
      "Ein oder mehrere Produkte in deiner Bestellung sind Vorbestellungen oder auf Anfrage. Hierfür gilt eine Lieferzeit von einigen Wochen bis zu mehreren Monaten.",
    confirm_items_title: "Bestellte Produkte",
    confirm_details_title: "Deine Angaben",
    confirm_no_payment:
      "Dies ist eine Bestellanfrage, keine Zahlung. Es wurde kein Betrag abgebucht — wir kontaktieren dich bezüglich der weiteren Abwicklung.",
    confirm_email_fallback_pre: "Möchtest du sichergehen, dass wir deine Bestellung erhalten haben?",
    confirm_email_fallback_link: "Sende die Daten auch per E-Mail",
    confirm_not_found_title: "Keine Bestellung gefunden",
    confirm_not_found_text: "Es gibt keine aktuelle Bestellung zum Anzeigen.",
    confirm_continue_shopping: "Weiter einkaufen",
    confirm_home: "Zur Startseite",

    legal_draft_warning_title: "Entwurfsversion.",
    legal_draft_warning_text: "Dieser Text ist ein Ausgangspunkt und muss vor dem Livegang rechtlich geprüft werden (u. a. DSGVO-Konformität).",

    privacy_title: "Datenschutzerklärung",
    privacy_h_data: "Welche Daten erfassen wir?",
    privacy_p_data: "Bei einer Bestellanfrage fragen wir nach deinem Namen, deiner Adresse, Postleitzahl, Stadt, deinem Land, deiner Telefonnummer (mit Landesvorwahl) und E-Mail-Adresse sowie optional einer Anmerkung zu deiner Bestellung.",
    privacy_h_why: "Warum erfassen wir diese Daten?",
    privacy_p_why: "Wir verwenden diese Daten ausschließlich, um deine Bestellanfrage zu bearbeiten, dich bezüglich Verfügbarkeit und Lieferzeit zu kontaktieren und die Bestellung abzuwickeln.",
    privacy_h_retention: "Speicherdauer",
    privacy_p_retention: "Wir speichern deine Daten so lange, wie es für die Abwicklung deiner Bestellung und etwaige gesetzliche (steuerliche) Aufbewahrungspflichten erforderlich ist.",
    privacy_h_sharing: "Weitergabe an Dritte",
    privacy_p_sharing: "Wir geben deine Daten nicht an Dritte weiter, außer wenn dies für die Lieferung deiner Bestellung notwendig ist (z. B. ein Versanddienstleister), und nur mit den dafür notwendigen Daten.",
    privacy_h_rights: "Deine Rechte",
    privacy_p_rights: "Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten sowie das Recht, der Verarbeitung zu widersprechen. Kontaktiere uns hierfür unter {email}.",
    privacy_h_security: "Sicherheit",
    privacy_p_security: "Wir treffen angemessene Maßnahmen, um deine Daten vor Verlust oder unbefugtem Zugriff zu schützen. Diese erste Version der Bestellanwendung läuft in einer Artifact-Umgebung ohne eigene Serverinfrastruktur; bevor in großem Umfang personenbezogene Daten über diese Anwendung verarbeitet werden, empfehlen wir eine Migration in eine eigene gesicherte Umgebung.",
    privacy_h_contact: "Kontakt",
    privacy_p_contact: "Fragen zu dieser Datenschutzerklärung? Schreibe an {email}.",

    terms_title: "Allgemeine Geschäftsbedingungen",
    terms_h1: "1. Geltungsbereich",
    terms_p1: "Diese Bedingungen gelten für jede Bestellanfrage, die über diese Website bei {shop} aufgegeben wird.",
    terms_h2: "2. Bestellanfragen",
    terms_p2: "Eine Bestellung über diese Website ist eine Bestellanfrage, kein Kaufvertrag und keine Zahlungsverpflichtung über die Website. {shop} nimmt nach Erhalt Kontakt zur Bestätigung und weiteren Abwicklung auf.",
    terms_h3: "3. Preise",
    terms_p3: "Angegebene Preise sind unverbindlich und vorbehaltlich Verfügbarkeit sowie etwaiger Preisänderungen bei Lieferanten.",
    terms_h4: "4. Lieferung",
    terms_p4: "Lieferzeiten variieren je nach Produkt. Produkte, die als Vorbestellung oder auf Anfrage gekennzeichnet sind, können eine Lieferzeit von einigen Wochen bis zu mehreren Monaten haben. Genannte Erscheinungsdaten sind unverbindlich.",
    terms_h5: "5. Zahlung",
    terms_p5: "Die Zahlung erfolgt außerhalb dieser Website, nach gegenseitiger Absprache nach Bestätigung deiner Bestellanfrage.",
    terms_h6: "6. Stornierung",
    terms_p6: "Du kannst eine Bestellanfrage stornieren, indem du uns über {email} kontaktierst, vorzugsweise so schnell wie möglich nach Aufgabe der Anfrage.",
    terms_h7: "7. Haftung",
    terms_p7: "{shop} bemüht sich, Bestellanfragen sorgfältig zu bearbeiten, haftet jedoch nicht für Verzögerungen, die außerhalb ihres Einflusses liegen, etwa Verzögerungen bei Lieferanten.",
    terms_h8: "8. Kontakt",
    terms_p8: "Fragen? Schreibe an {email}.",

    cookies_title: "Cookie-Richtlinie",
    cookies_h_none: "Keine Tracking-Cookies",
    cookies_p_none: "Diese Website verwendet keine Tracking- oder Werbe-Cookies.",
    cookies_h_functional: "Funktionale Speicherung",
    cookies_p_functional: "Um den Katalog und die Bestellungen anzeigen und verarbeiten zu können, werden die notwendigen Daten (Produkte und Bestelldaten) gespeichert. Dies dient ausschließlich dem Funktionieren der Shop-Funktionalität, nicht Tracking- oder Werbezwecken.",
    cookies_h_contact: "Kontakt",
    cookies_p_contact: "Fragen zu dieser Cookie-Richtlinie? Schreibe an {email}.",

    footer_tagline: "Community-Katalog für Pokémon, One Piece, Lorcana und Dragon Ball TCG. Bestellanfragen werden persönlich von uns bearbeitet — kein Webshop, keine Online-Zahlung.",
    footer_shop_heading: "Shop",
    footer_info_heading: "Informationen",
    footer_bottom_note: "© {year} MNJCollective — Bestellanfragen sind keine Zahlungen.",
    footer_admin_link: "Verwaltung",

    admin_login_title: "Verwaltungsbereich",
    admin_login_subtitle: "Gib den Zugangscode ein, um Produkte und Bestellungen zu verwalten.",
    admin_login_placeholder: "Zugangscode",
    admin_login_error: "Falscher Zugangscode.",
    admin_login_button: "Anmelden",
    admin_back_to_site: "Zurück zur Website",

    admin_header_title: "MNJCollective — Verwaltung",
    admin_view_site: "Website ansehen",
    admin_logout: "Abmelden",
    admin_tab_products: "Produkte",
    admin_tab_orders: "Bestellungen",
    admin_tab_invite: "Einladen",
    invite_title: "Kunde per WhatsApp einladen",
    invite_subtitle: "Gib eine Telefonnummer ein und erstelle eine fertige WhatsApp-Einladung mit Link zum Shop.",
    invite_field_name: "Name (optional)",
    invite_field_name_placeholder: "Z. B. Sanne",
    invite_field_phone: "Telefonnummer",
    invite_field_shop_url: "Link zu deinem Shop",
    invite_field_shop_url_placeholder: "https://tcghaven.nl",
    invite_message_label: "Nachrichtentext",
    invite_generate: "WhatsApp-Link öffnen",
    invite_copy: "Link kopieren",
    invite_copied: "Kopiert ✓",
    invite_default_message: "Hallo{name}! Du bist eingeladen, bei MNJCollective zu bestellen — sieh dir den Katalog an und sende deine Bestellanfrage über {url}",

    admin_products_heading: "Produkte ({count})",
    admin_new_product: "Neues Produkt",
    admin_no_products_title: "Noch keine Produkte",
    admin_no_products_text: "Füge dein erstes Produkt hinzu, um den Katalog zu füllen.",
    admin_hidden_suffix: "(ausgeblendet)",
    admin_action_show: "Anzeigen",
    admin_action_hide: "Ausblenden",
    admin_action_edit: "Bearbeiten",
    admin_action_delete: "Löschen",
    admin_delete_confirm: 'Bist du sicher, dass du "{name}" löschen möchtest?',

    form_edit_title: "Produkt bearbeiten",
    form_new_title: "Neues Produkt",
    form_field_name: "Produktname",
    form_field_category: "Kategorie",
    form_field_price: "Preis (€)",
    form_field_short_desc: "Kurzbeschreibung",
    form_field_short_desc_placeholder: "Wird auf der Produktkarte angezeigt",
    form_field_full_desc: "Ausführliche Beschreibung",
    form_field_status: "Verfügbarkeitsstatus",
    form_status_in_stock: "🟢 Auf Lager",
    form_status_preorder: "🟡 Vorbestellung",
    form_status_on_demand: "🔵 Auf Anfrage",
    form_field_expected_date: "Erwartetes Erscheinungs-/Lieferdatum",
    form_field_expected_date_placeholder: "Z. B. Erwartet: Nov. 2026",
    form_field_delivery_note: "Zusätzliche Lieferzeit-Anmerkung",
    form_field_image_url: "Bild-URL",
    form_image_help: "Lade ein eigenes Foto hoch oder füge einen direkten Bildlink ein.",
    form_image_upload_btn: "Hochladen",
    form_image_uploading: "Wird hochgeladen...",
    form_image_preview_fail: "Bild konnte nicht geladen werden",
    form_image_preview_empty: "Noch kein Bild",
    form_field_visible: "Produkt auf der Website sichtbar",
    form_error_required: "Name, Kategorie und Preis sind erforderlich.",
    form_cancel: "Abbrechen",
    form_save: "Produkt speichern",
    form_translations_toggle: "Übersetzungen hinzufügen (optional)",
    form_translations_hint: "Leer gelassene Felder zeigen Besuchern automatisch den niederländischen Text.",
    form_lang_section_en: "Englisch",
    form_lang_section_de: "Deutsch",

    admin_orders_heading: "Bestellungen ({count})",
    admin_status_filter_all: "Alle",
    admin_refresh_label: "Aktualisieren",
    admin_orders_empty_title: "Keine Bestellungen",
    admin_orders_empty_text: "Es sind noch keine Bestellanfragen eingegangen.",
    admin_orders_loading: "Bestellungen werden geladen...",
    admin_email_sent: "gesendet",
    admin_email_check: "manuell prüfen",
    admin_detail_customer: "Kunde",
    admin_detail_email: "E-Mail",
    admin_detail_phone: "Telefon",
    admin_detail_address: "Adresse",
    admin_detail_note: "Anmerkung",
    admin_detail_products: "Produkte",
    admin_detail_total: "Gesamt",

    order_status_new: "Neu",
    order_status_processing: "In Bearbeitung",
    order_status_ordered_supplier: "Beim Lieferanten bestellt",
    order_status_ready: "Versandbereit",
    order_status_shipped: "Versendet",
    order_status_cancelled: "Storniert",
  },

  en: {
    nav_home: "Home",
    nav_products: "Products",
    nav_cart: "Cart",
    lang_label: "Language",
    loading_generic: "Loading...",

    hero_eyebrow: "Community order catalog",
    hero_title: "Pokémon, One Piece, Lorcana & Dragon Ball — ordered through the community that gets it.",
    hero_lead:
      "Browse the catalog and place an order request — no account, no online payment. We'll personally get in touch afterwards about availability and shipping.",
    hero_cta_catalog: "View all products",
    hero_cta_cart: "Go to cart",
    status_stock_card_title: "🟢 IN STOCK",
    status_stock_card_desc: "Available right away. These products are physically ready with us.",
    status_preorder_card_title: "🟡 PRE-ORDER",
    status_preorder_card_desc: "Not out yet, but already reservable. The expected date is shown on the product.",
    status_ondemand_card_title: "🔵 ON DEMAND",
    status_ondemand_card_desc: "Ordered specially for you from our supplier after your order request.",
    home_featured_title: "Featured",
    home_view_all: "All products",
    home_categories_title: "Categories",

    status_in_stock_badge: "IN STOCK",
    status_preorder_badge: "PRE-ORDER",
    status_on_demand_badge: "ON DEMAND",
    status_in_stock_short: "In stock",
    status_preorder_short: "Pre-order",
    status_on_demand_short: "On demand",

    delivery_explainer_full:
      "Not all products can be delivered directly from stock. Some products are available as pre-order or are ordered on demand. For these products, the delivery time can vary from a few weeks to several months, depending on factors such as order volume, release dates, supplier availability and transport.",
    delivery_explainer_compact:
      "Delivery times can vary from a few weeks to several months for pre-order and on-demand products.",

    card_view_product: "View product",
    card_quick_add: "Add straight to cart",

    catalog_title: "All products",
    catalog_search_placeholder: "Search by name or description...",
    catalog_filter_all: "All",
    catalog_filter_all_status: "All statuses",
    catalog_empty_title: "No products found",
    catalog_empty_text: "Try a different search term or adjust the filters.",

    product_back_to_catalog: "Back to products",
    product_not_found_title: "Product not found",
    product_not_found_text: "This product no longer exists or is no longer visible.",
    product_back_to_all: "Go to all products",
    product_in_stock_notice: "This product is available right away.",
    product_longlead_title: "Longer delivery time applies.",
    product_longlead_body: "This product is {status} and may have a delivery time of a few weeks to several months.",
    product_add_to_cart: "Add to cart",
    product_added: "Added ✓",

    cart_title: "Cart",
    cart_empty_title: "Your cart is empty",
    cart_empty_text: "Browse the catalog and add products to place an order request.",
    cart_browse: "Browse products",
    cart_warning:
      "Please note: your cart contains one or more pre-order or on-demand products. These may have a delivery time of a few weeks to several months. If your order contains multiple products, the one with the longest lead time determines when the whole order is ready to ship.",
    cart_item_count: "Number of items",
    cart_total: "Total (indicative)",
    cart_no_payment_note: "This amount is not charged through this website. No online payment takes place.",
    cart_continue_shopping: "Continue shopping",
    cart_place_order: "Place order",

    checkout_back_to_cart: "Back to cart",
    checkout_title: "Order details",
    checkout_subtitle: "This is an order request — no payment is processed. We'll get in touch after we receive it.",
    checkout_longlead_warning:
      "Your order contains pre-order and/or on-demand products. Please allow for a delivery time of a few weeks to several months before sending your order request.",
    field_name: "Name",
    field_name_placeholder: "First and last name",
    field_address: "Address",
    field_address_placeholder: "Street and house number",
    field_postal: "Postal code",
    field_city: "City",
    field_country: "Country",
    field_phone: "Phone number",
    field_phone_placeholder: "6 12345678",
    field_phone_hint: "Enter your number without the country code, e.g. 612345678.",
    field_email: "Email address",
    field_email_placeholder: "you@example.com",
    field_note: "Order note (optional)",
    field_note_placeholder: "E.g. preferred pickup or shipping option",
    checkout_summary_title: "Summary",
    checkout_consent_pre: "I agree to the",
    checkout_terms_link: "terms and conditions",
    checkout_and: "and",
    checkout_privacy_link: "privacy policy",
    checkout_consent_post:
      ". I understand this is an order request without payment and without guaranteed immediate delivery.",
    checkout_submitting: "Submitting...",
    checkout_submit: "Send order request",
    checkout_submit_note: "This is an order request, not a payment. No amount will be charged.",
    checkout_error_generic: "Something went wrong saving your order. Please try again or contact us via {email}.",

    err_name: "Name is required.",
    err_address: "Address is required.",
    err_postal: "Postal code is required.",
    err_city: "City is required.",
    err_country: "Country is required.",
    err_phone_required: "Phone number is required.",
    err_phone_invalid: "Enter a valid phone number.",
    err_email_required: "Email address is required.",
    err_email_invalid: "Enter a valid email address.",
    err_consent: "You need to agree before sending your order request.",

    confirm_title: "Thanks for your order request!",
    confirm_received: "Your order has been received. We'll process it and get in touch if needed.",
    confirm_longlead:
      "One or more products in your order are pre-order or on-demand. These carry a delivery time of a few weeks to several months.",
    confirm_items_title: "Ordered products",
    confirm_details_title: "Your details",
    confirm_no_payment:
      "This is an order request, not a payment. No amount has been charged — we'll contact you about the next steps.",
    confirm_email_fallback_pre: "Want to make sure we received your order?",
    confirm_email_fallback_link: "Also send the details by email",
    confirm_not_found_title: "No order found",
    confirm_not_found_text: "There's no recent order to show.",
    confirm_continue_shopping: "Continue shopping",
    confirm_home: "Go to home",

    legal_draft_warning_title: "Draft version.",
    legal_draft_warning_text: "This text is a starting point and must be reviewed by a lawyer before going live (including GDPR compliance).",

    privacy_title: "Privacy Policy",
    privacy_h_data: "What data do we collect?",
    privacy_p_data: "When placing an order request, we ask for your name, address, postal code, city, country, phone number (with country code) and email address, plus an optional note with your order.",
    privacy_h_why: "Why do we collect this data?",
    privacy_p_why: "We use this data solely to process your order request, contact you about availability and delivery time, and handle the order further.",
    privacy_h_retention: "Retention period",
    privacy_p_retention: "We keep your data for as long as necessary to handle your order and to meet any legal (tax) retention obligations.",
    privacy_h_sharing: "Sharing with third parties",
    privacy_p_sharing: "We do not share your data with third parties, except where necessary for delivering your order (for example, a shipping carrier), and only with the data needed for that purpose.",
    privacy_h_rights: "Your rights",
    privacy_p_rights: "You have the right to access, correct and delete your data, and the right to object to its processing. Contact us at {email} for this.",
    privacy_h_security: "Security",
    privacy_p_security: "We take appropriate measures to protect your data against loss or unauthorized access. This first version of the order application runs within an artifact environment without its own server infrastructure; before personal data is processed through this application at scale, we recommend migrating to a dedicated secure environment.",
    privacy_h_contact: "Contact",
    privacy_p_contact: "Questions about this privacy policy? Email {email}.",

    terms_title: "Terms and Conditions",
    terms_h1: "1. Applicability",
    terms_p1: "These terms apply to every order request placed via this website with {shop}.",
    terms_h2: "2. Order requests",
    terms_p2: "An order through this website is an order request, not a purchase agreement and not a payment obligation via the website. {shop} will contact you after receipt to confirm and further process it.",
    terms_h3: "3. Prices",
    terms_p3: "Listed prices are indicative and subject to availability and any price changes by suppliers.",
    terms_h4: "4. Delivery",
    terms_p4: "Delivery times vary per product. Products marked as pre-order or on-demand may have a delivery time of a few weeks to several months. Stated release dates are indicative.",
    terms_h5: "5. Payment",
    terms_p5: "Payment takes place outside this website, by mutual agreement after confirmation of your order request.",
    terms_h6: "6. Cancellation",
    terms_p6: "You can cancel an order request by contacting us at {email}, preferably as soon as possible after placing the request.",
    terms_h7: "7. Liability",
    terms_p7: "{shop} makes every effort to process order requests carefully, but is not liable for delays outside its control, such as delays at suppliers.",
    terms_h8: "8. Contact",
    terms_p8: "Questions? Email {email}.",

    cookies_title: "Cookie Policy",
    cookies_h_none: "No tracking cookies",
    cookies_p_none: "This website does not use tracking or advertising cookies.",
    cookies_h_functional: "Functional storage",
    cookies_p_functional: "To display and process the catalog and orders, the necessary data (products and order data) is stored. This is solely to make the shop functionality work, not for tracking or advertising purposes.",
    cookies_h_contact: "Contact",
    cookies_p_contact: "Questions about this cookie policy? Email {email}.",

    footer_tagline: "Community catalog for Pokémon, One Piece, Lorcana and Dragon Ball TCG. Order requests are handled by us personally — no webshop, no online payment.",
    footer_shop_heading: "Shop",
    footer_info_heading: "Information",
    footer_bottom_note: "© {year} MNJCollective — order requests are not payments.",
    footer_admin_link: "Admin",

    admin_login_title: "Admin area",
    admin_login_subtitle: "Enter the access code to manage products and orders.",
    admin_login_placeholder: "Access code",
    admin_login_error: "Incorrect access code.",
    admin_login_button: "Log in",
    admin_back_to_site: "Back to website",

    admin_header_title: "MNJCollective — Admin",
    admin_view_site: "View website",
    admin_logout: "Log out",
    admin_tab_products: "Products",
    admin_tab_orders: "Orders",
    admin_tab_invite: "Invite",
    invite_title: "Invite a customer via WhatsApp",
    invite_subtitle: "Enter a phone number and generate a ready-made WhatsApp invitation with a link to the shop.",
    invite_field_name: "Name (optional)",
    invite_field_name_placeholder: "E.g. Sanne",
    invite_field_phone: "Phone number",
    invite_field_shop_url: "Link to your shop",
    invite_field_shop_url_placeholder: "https://tcghaven.nl",
    invite_message_label: "Message text",
    invite_generate: "Open WhatsApp link",
    invite_copy: "Copy link",
    invite_copied: "Copied ✓",
    invite_default_message: "Hi{name}! You're invited to order from MNJCollective — check out the catalog and send your order request via {url}",

    admin_products_heading: "Products ({count})",
    admin_new_product: "New product",
    admin_no_products_title: "No products yet",
    admin_no_products_text: "Add your first product to populate the catalog.",
    admin_hidden_suffix: "(hidden)",
    admin_action_show: "Show",
    admin_action_hide: "Hide",
    admin_action_edit: "Edit",
    admin_action_delete: "Delete",
    admin_delete_confirm: 'Are you sure you want to delete "{name}"?',

    form_edit_title: "Edit product",
    form_new_title: "New product",
    form_field_name: "Product name",
    form_field_category: "Category",
    form_field_price: "Price (€)",
    form_field_short_desc: "Short description",
    form_field_short_desc_placeholder: "Shown on the product card",
    form_field_full_desc: "Full description",
    form_field_status: "Availability status",
    form_status_in_stock: "🟢 In stock",
    form_status_preorder: "🟡 Pre-order",
    form_status_on_demand: "🔵 On demand",
    form_field_expected_date: "Expected release/delivery date",
    form_field_expected_date_placeholder: "E.g. Expected: Nov 2026",
    form_field_delivery_note: "Extra delivery-time note",
    form_field_image_url: "Image URL",
    form_image_help: "Upload your own photo, or paste a direct link to an image.",
    form_image_upload_btn: "Upload",
    form_image_uploading: "Uploading...",
    form_image_preview_fail: "Image could not be loaded",
    form_image_preview_empty: "No image yet",
    form_field_visible: "Product visible on the website",
    form_error_required: "Name, category and price are required.",
    form_cancel: "Cancel",
    form_save: "Save product",
    form_translations_toggle: "Add translations (optional)",
    form_translations_hint: "Fields left empty will automatically show the Dutch text to visitors.",
    form_lang_section_en: "English",
    form_lang_section_de: "German",

    admin_orders_heading: "Orders ({count})",
    admin_status_filter_all: "All",
    admin_refresh_label: "Refresh",
    admin_orders_empty_title: "No orders",
    admin_orders_empty_text: "No order requests have come in yet.",
    admin_orders_loading: "Loading orders...",
    admin_email_sent: "sent",
    admin_email_check: "check manually",
    admin_detail_customer: "Customer",
    admin_detail_email: "Email",
    admin_detail_phone: "Phone",
    admin_detail_address: "Address",
    admin_detail_note: "Note",
    admin_detail_products: "Products",
    admin_detail_total: "Total",

    order_status_new: "New",
    order_status_processing: "Processing",
    order_status_ordered_supplier: "Ordered from supplier",
    order_status_ready: "Ready to ship",
    order_status_shipped: "Shipped",
    order_status_cancelled: "Cancelled",
  },
};

const LangContext = createContext({ lang: "nl", setLang: () => {}, t: (k) => k });

function useT() {
  return useContext(LangContext);
}

function makeTranslator(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.nl;
  return function t(key, vars) {
    let str = dict[key] ?? TRANSLATIONS.nl[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
      });
    }
    return str;
  };
}

// Helper: haalt het vertaalde productveld op, met terugval naar de
// Nederlandse basiswaarde als er (nog) geen vertaling is ingevuld.
function resolveProductField(product, lang, field) {
  if (lang && lang !== "nl" && product.translations && product.translations[lang]) {
    const val = product.translations[lang][field];
    if (val && val.trim()) return val;
  }
  return product[field] || "";
}

/* ============================================================================
   CONFIGURATIE — DIT MOET JIJ (ALI) INVULLEN VOOR PRODUCTIE
   ============================================================================
   Alles wat je hieronder moet aanpassen staat gemarkeerd met "// <-- WIJZIG DIT".
   ========================================================================= */

// --- EmailJS (https://www.emailjs.com) -------------------------------------
// 1. Maak een gratis account op emailjs.com
// 2. Voeg een "Email Service" toe (bv. Gmail/Outlook) -> je krijgt een Service ID
// 3. Maak een "Email Template" met de variabelen die hieronder bij
//    sendOrderEmail() staan (order_number, customer_name, order_items, ...)
//    -> je krijgt een Template ID
// 4. Account -> General -> "Public Key"
// Vul de 3 waarden hieronder in. Zolang dit nog "YOUR_..." is, verstuurt de
// app geen echte mail maar valt automatisch terug op lokale opslag + een
// handmatige mailto-link, zodat er nooit een bestelling zoekraakt.
const EMAILJS_CONFIG = {
  serviceId: "service_yk1ncgl",
  templateId: "template_zugqmbp",
  publicKey: "UHeJys1FyGHrNo-Gh",
};

// --- Admin toegang -----------------------------------------------------------
// De toegangscode wordt in deze versie NIET meer in de code bewaard, maar als
// environment variable ADMIN_SECRET in je Netlify-projectinstellingen gezet
// (Site settings -> Environment variables). De server (netlify/functions/)
// controleert elke admin-actie hiertegen — dat is echte beveiliging, in
// tegenstelling tot de client-side check uit de eerdere artifact-versie.

const SHOP_EMAIL = "info@tcghaven.nl";
const SHOP_NAME = "MNJCollective";

// De e-mail naar de shop en de mailto-fallback blijven bewust altijd in het
// Nederlands, ongeacht de taal die een bezoeker koos — zo blijven binnen-
// komende bestelmails voor jou als beheerder consistent leesbaar.
const OPERATIONAL_LANG = "nl";

/* ============================================================================
   STATISCHE DATA
   ========================================================================= */

const SUPPORTED_LANGUAGES = [
  { code: "nl", label: "NL", flag: "🇳🇱" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

const COUNTRIES = [
  { code: "NL", name: "Nederland", dial: "+31", flag: "🇳🇱" },
  { code: "DE", name: "Duitsland", dial: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Italië", dial: "+39", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "BE", name: "België", dial: "+32", flag: "🇧🇪" },
  { code: "FR", name: "Frankrijk", dial: "+33", flag: "🇫🇷" },
  { code: "ES", name: "Spanje", dial: "+34", flag: "🇪🇸" },
  { code: "AT", name: "Oostenrijk", dial: "+43", flag: "🇦🇹" },
  { code: "CH", name: "Zwitserland", dial: "+41", flag: "🇨🇭" },
  { code: "PL", name: "Polen", dial: "+48", flag: "🇵🇱" },
  { code: "IE", name: "Ierland", dial: "+353", flag: "🇮🇪" },
  { code: "SE", name: "Zweden", dial: "+46", flag: "🇸🇪" },
  { code: "DK", name: "Denemarken", dial: "+45", flag: "🇩🇰" },
  { code: "GB", name: "Verenigd Koninkrijk", dial: "+44", flag: "🇬🇧" },
  { code: "US", name: "Verenigde Staten", dial: "+1", flag: "🇺🇸" },
];

// Bestelstatussen als taal-onafhankelijke codes; de weergavetekst komt uit
// TRANSLATIONS (order_status_<code>). Zo blijft de opgeslagen status altijd
// consistent, ongeacht in welke taal het adminpaneel wordt bekeken.
const ORDER_STATUS_CODES = ["new", "processing", "ordered_supplier", "ready", "shipped", "cancelled"];

// Kleur/emoji per beschikbaarheidsstatus (taal-onafhankelijk). De weergave-
// tekst (label/short) komt via statusLabel(status, t) uit TRANSLATIONS.
const STATUS_META = {
  in_stock: { cls: "stock", emoji: "🟢" },
  preorder: { cls: "preorder", emoji: "🟡" },
  on_demand: { cls: "ondemand", emoji: "🔵" },
};

function statusLabel(status, t) {
  const meta = STATUS_META[status] || STATUS_META.in_stock;
  return {
    cls: meta.cls,
    emoji: meta.emoji,
    label: t(`status_${status}_badge`),
    short: t(`status_${status}_short`),
  };
}

const DEFAULT_CATEGORIES = ["Pokémon", "One Piece", "Lorcana", "Dragon Ball", "Overig"];

const SEED_PRODUCTS = [
  {
    id: "seed-1",
    name: "Pokémon TCG — Scarlet & Violet Boosterbox",
    shortDescription: "36 boosterpacks, verzegeld, Engelstalige editie.",
    fullDescription:
      "Volledige boosterbox van de Scarlet & Violet basisset. Bevat 36 boosterpacks van elk 10 kaarten, inclusief kans op holo- en full-artkaarten. Geschikt voor verzamelaars en spelers die in één keer een grote hoeveelheid packs willen openen.",
    price: 135,
    category: "Pokémon",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Pok%C3%A9mon+TCG",
    visible: true,
    translations: {
      en: {
        shortDescription: "36 booster packs, sealed, English-language edition.",
        fullDescription:
          "Full booster box of the Scarlet & Violet base set. Contains 36 booster packs of 10 cards each, with a chance at holo and full-art cards. Great for collectors and players who want to open a large batch of packs at once.",
      },
      de: {
        shortDescription: "36 Boosterpacks, versiegelt, englischsprachige Edition.",
        fullDescription:
          "Vollständige Booster Box des Scarlet & Violet Grundsets. Enthält 36 Boosterpacks mit je 10 Karten, inklusive Chance auf Holo- und Full-Art-Karten. Geeignet für Sammler und Spieler, die auf einmal eine große Menge Packs öffnen möchten.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Pokémon TCG — Paldea Evolved Elite Trainer Box",
    shortDescription: "9 boosterpacks + accessoires in Elite Trainer Box.",
    fullDescription:
      "De Elite Trainer Box bevat 9 boosterpacks, een spelmat, kaarthoesjes, energiekaarten, teller-dobbelstenen en een collector's box om alles in te bewaren. Ideaal startpunt voor nieuwe spelers of als aanvulling op een bestaande collectie.",
    price: 54.95,
    category: "Pokémon",
    status: "preorder",
    expectedDate: "Verwacht: oktober 2026",
    deliveryNote: "Pre-order bij de leverancier; datum kan door de leverancier nog wijzigen.",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Elite+Trainer+Box",
    visible: true,
    translations: {
      en: {
        shortDescription: "9 booster packs + accessories in an Elite Trainer Box.",
        fullDescription:
          "The Elite Trainer Box contains 9 booster packs, a playmat, card sleeves, energy cards, counter dice and a collector's box to store everything in. An ideal starting point for new players or as an addition to an existing collection.",
      },
      de: {
        shortDescription: "9 Boosterpacks + Zubehör in einer Elite Trainer Box.",
        fullDescription:
          "Die Elite Trainer Box enthält 9 Boosterpacks, eine Spielmatte, Kartenhüllen, Energiekarten, Zähler-Würfel und eine Sammlerbox zur Aufbewahrung. Ideal für neue Spieler oder als Ergänzung zu einer bestehenden Sammlung.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "One Piece TCG — OP-09 Booster Box",
    shortDescription: "24 boosterpacks van de OP-09 set, verzegeld.",
    fullDescription:
      "Booster box van OP-09 met 24 packs van elk 12 kaarten. Bevat kans op leaders, alternate arts en SEC-kaarten uit deze set. Verzegeld en ongeopend.",
    price: 120,
    category: "One Piece",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=One+Piece+TCG",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    name: "One Piece TCG — OP-10 Booster Box",
    shortDescription: "Nog niet uitgekomen; alvast te reserveren.",
    fullDescription:
      "Reserveer de nieuwe OP-10 set voordat deze uitkomt. Zodra de set beschikbaar is bij onze leverancier wordt deze ingepland voor verzending. Bij grote drukte kan de levertijd na release oplopen.",
    price: 125,
    category: "One Piece",
    status: "preorder",
    expectedDate: "Verwacht: november 2026",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=One+Piece+OP-10",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    name: "Disney Lorcana — Shimmering Skies Booster Pack",
    shortDescription: "Losse booster pack, 12 kaarten.",
    fullDescription:
      "Eén boosterpack uit de Shimmering Skies set met 12 kaarten. Leuk om los te proberen of om een bestaande collectie aan te vullen.",
    price: 4.5,
    category: "Lorcana",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Lorcana",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    name: "Disney Lorcana — Azurite Sea Booster Box",
    shortDescription: "24 packs, wordt speciaal voor je besteld.",
    fullDescription:
      "Deze set houden we niet standaard op voorraad. Bij bestelling plaatsen we een order bij onze leverancier speciaal voor jou. Neem de langere levertijd van on-demand producten in overweging.",
    price: 140,
    category: "Lorcana",
    status: "on_demand",
    expectedDate: "",
    deliveryNote: "On-demand besteld bij leverancier na ontvangst van je bestelverzoek.",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Azurite+Sea",
    visible: true,
    translations: {
      en: {
        shortDescription: "24 packs, ordered specially for you.",
        fullDescription:
          "We don't keep this set in stock as standard. When you order, we place a request with our supplier specifically for you. Please take the longer lead time of on-demand products into account.",
      },
      de: {
        shortDescription: "24 Packs, wird speziell für dich bestellt.",
        fullDescription:
          "Dieses Set führen wir nicht standardmäßig auf Lager. Bei Bestellung platzieren wir speziell für dich eine Order bei unserem Lieferanten. Bitte beachte die längere Lieferzeit von Produkten auf Anfrage.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-7",
    name: "Dragon Ball Super Card Game — Booster Box",
    shortDescription: "24 packs, on-demand besteld.",
    fullDescription:
      "Populaire boosterbox uit de Dragon Ball Super Card Game. Wordt on-demand ingekocht zodra we een bestelverzoek ontvangen.",
    price: 95,
    category: "Dragon Ball",
    status: "on_demand",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Dragon+Ball+TCG",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-8",
    name: "Dragon Ball Super Card Game — Starter Deck",
    shortDescription: "Kant-en-klaar startdeck, direct speelklaar.",
    fullDescription:
      "Een compleet startdeck waarmee je direct kunt spelen. Inclusief speluitleg, ideaal voor nieuwe spelers binnen de community.",
    price: 14.95,
    category: "Dragon Ball",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Starter+Deck",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* ============================================================================
   STYLING — ontwerp-tokens: warme "inktzwarte" achtergrond, ember-oranje
   gradient, Fraunces (display) / Inter (body) / JetBrains Mono (prijzen,
   bestelnummers, badges — zoals stat-blokken op een echte kaartverpakking).
   ========================================================================= */

const APP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

.tcg-app {
  --ink: #16110c;
  --ink-2: #1f1811;
  --ink-3: #2a2015;
  --ink-border: #3a2d1f;
  --ink-border-soft: #2e241a;
  --ember-1: #ff8a3d;
  --ember-2: #e8460c;
  --parchment: #f4ebdd;
  --parchment-dim: #b8a791;
  --parchment-faint: #8a7a66;
  --stock: #3dd68c;
  --preorder: #f0b429;
  --ondemand: #4fa3f7;
  --danger: #ef5350;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-pill: 999px;
  --shadow: 0 14px 40px -14px rgba(0,0,0,0.6);
  --shadow-sm: 0 6px 16px -8px rgba(0,0,0,0.5);

  background: var(--ink);
  color: var(--parchment);
  font-family: var(--font-body);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.tcg-app * { box-sizing: border-box; }
.tcg-app a { color: inherit; text-decoration: none; }
.tcg-app button { font-family: inherit; cursor: pointer; }
.tcg-app input, .tcg-app select, .tcg-app textarea { font-family: inherit; }

.tcg-app :focus-visible {
  outline: 2px solid var(--ember-1);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .tcg-app * { animation: none !important; transition: none !important; }
}

.tcg-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
@media (max-width: 640px) { .tcg-container { padding: 0 16px; } }

.tcg-section { padding: 48px 0; }
.tcg-section.tight { padding: 28px 0; }

/* ---- Header ---- */
.tcg-header {
  position: sticky; top: 0; z-index: 40;
  background: rgba(22,17,12,0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--ink-border-soft);
}
.tcg-header-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; max-width: 1180px; margin: 0 auto; gap: 12px; flex-wrap: wrap;
}
.tcg-logo { display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 0; }
.tcg-logo-mark {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--ember-1), var(--ember-2));
  display: flex; align-items: center; justify-content: center;
  color: var(--ink); flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}
.tcg-logo-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; color: var(--parchment); letter-spacing: 0.2px; }
.tcg-logo-text span { background: linear-gradient(135deg, var(--ember-1), var(--ember-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }

.tcg-header-right { display: flex; align-items: center; gap: 10px; }
.tcg-nav { display: flex; align-items: center; gap: 4px; }
.tcg-nav-link {
  padding: 8px 14px; border-radius: var(--radius-pill); font-size: 14.5px; font-weight: 500;
  color: var(--parchment-dim); background: none; border: none; transition: color .15s, background .15s;
}
.tcg-nav-link:hover { color: var(--parchment); background: var(--ink-3); }
.tcg-nav-link.active { color: var(--ink); background: linear-gradient(135deg, var(--ember-1), var(--ember-2)); font-weight: 600; }

.tcg-lang-select {
  background: var(--ink-2); border: 1px solid var(--ink-border); color: var(--parchment);
  padding: 8px 10px; border-radius: var(--radius-pill); font-size: 13px; font-weight: 600;
  font-family: var(--font-mono); appearance: none; -webkit-appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--parchment-dim) 50%), linear-gradient(135deg, var(--parchment-dim) 50%, transparent 50%);
  background-position: right 12px top 55%, right 7px top 55%;
  background-size: 5px 5px, 5px 5px; background-repeat: no-repeat;
  padding-right: 26px;
}
.tcg-lang-select:hover { border-color: var(--ember-1); }

.tcg-cart-btn {
  position: relative; display: flex; align-items: center; gap: 8px;
  background: var(--ink-2); border: 1px solid var(--ink-border); color: var(--parchment);
  padding: 9px 16px; border-radius: var(--radius-pill); font-size: 14.5px; font-weight: 600;
  transition: border-color .15s, transform .15s;
}
.tcg-cart-btn:hover { border-color: var(--ember-1); transform: translateY(-1px); }
.tcg-cart-badge {
  position: absolute; top: -7px; right: -7px; min-width: 20px; height: 20px; padding: 0 5px;
  background: linear-gradient(135deg, var(--ember-1), var(--ember-2)); color: var(--ink);
  border-radius: 999px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); box-shadow: 0 0 0 2px var(--ink);
}

/* ---- Buttons ---- */
.tcg-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: var(--radius-pill); font-weight: 600; font-size: 15px; padding: 13px 26px;
  border: none; transition: transform .15s, box-shadow .15s, opacity .15s, background .15s;
  white-space: nowrap;
}
.tcg-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.tcg-btn-primary {
  background: linear-gradient(135deg, var(--ember-1), var(--ember-2)); color: #1a0f06;
  box-shadow: 0 10px 28px -10px rgba(232,70,12,0.55);
}
.tcg-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px -10px rgba(232,70,12,0.7); }
.tcg-btn-secondary {
  background: var(--ink-2); color: var(--parchment); border: 1px solid var(--ink-border);
}
.tcg-btn-secondary:hover:not(:disabled) { border-color: var(--ember-1); color: var(--ember-1); }
.tcg-btn-ghost { background: none; color: var(--parchment-dim); padding: 10px 16px; }
.tcg-btn-ghost:hover { color: var(--parchment); }
.tcg-btn-danger { background: rgba(239,83,80,0.12); color: #ff8783; border: 1px solid rgba(239,83,80,0.35); }
.tcg-btn-danger:hover:not(:disabled) { background: rgba(239,83,80,0.2); }
.tcg-btn-sm { padding: 8px 14px; font-size: 13.5px; }
.tcg-btn-block { width: 100%; }
.tcg-btn-icon { padding: 9px; border-radius: var(--radius-pill); background: var(--ink-3); border: 1px solid var(--ink-border); color: var(--parchment-dim); }
.tcg-btn-icon:hover { color: var(--parchment); border-color: var(--ember-1); }
.tcg-btn-icon.added { color: var(--stock); border-color: var(--stock); background: rgba(61,214,140,0.12); }

/* ---- Badges (foil-stamp signature element) ---- */
.tcg-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em;
  padding: 6px 13px; border-radius: var(--radius-pill); border: 1px solid transparent;
  background-size: 200% 100%; background-position: 0% 0%;
  transition: background-position .5s ease;
}
.tcg-badge:hover { background-position: 100% 0%; }
.tcg-badge.stock { background-image: linear-gradient(100deg, rgba(61,214,140,0.16), rgba(61,214,140,0.28), rgba(61,214,140,0.16)); color: var(--stock); border-color: rgba(61,214,140,0.35); }
.tcg-badge.preorder { background-image: linear-gradient(100deg, rgba(240,180,41,0.16), rgba(240,180,41,0.28), rgba(240,180,41,0.16)); color: var(--preorder); border-color: rgba(240,180,41,0.35); }
.tcg-badge.ondemand { background-image: linear-gradient(100deg, rgba(79,163,247,0.16), rgba(79,163,247,0.28), rgba(79,163,247,0.16)); color: var(--ondemand); border-color: rgba(79,163,247,0.35); }

.tcg-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: var(--radius-pill);
  background: var(--ink-2); border: 1px solid var(--ink-border); color: var(--parchment-dim);
  font-size: 13.5px; font-weight: 500; transition: all .15s;
}
.tcg-pill.active { background: linear-gradient(135deg, var(--ember-1), var(--ember-2)); color: #1a0f06; border-color: transparent; font-weight: 700; }
.tcg-pill:hover:not(.active) { border-color: var(--ember-1); color: var(--parchment); }

/* ---- Hero ---- */
.tcg-hero { position: relative; padding: 64px 0 40px; overflow: hidden; }
.tcg-hero::before {
  content: ''; position: absolute; top: -140px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 500px; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255,138,61,0.16), transparent);
  pointer-events: none;
}
.tcg-eyebrow {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600; letter-spacing: 0.14em;
  color: var(--ember-1); text-transform: uppercase; margin-bottom: 16px; display: block;
}
.tcg-h1 { font-family: var(--font-display); font-size: clamp(32px, 5.5vw, 54px); font-weight: 700; line-height: 1.08; letter-spacing: -0.01em; max-width: 780px; margin: 0 0 20px; }
.tcg-lead { font-size: 17px; color: var(--parchment-dim); max-width: 600px; margin: 0 0 32px; line-height: 1.6; }
.tcg-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }

.tcg-status-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; position: relative; }
@media (max-width: 760px) { .tcg-status-strip { grid-template-columns: 1fr; } }
.tcg-status-card { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg); padding: 20px; }
.tcg-status-card-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tcg-status-card-icon.stock { background: rgba(61,214,140,0.14); color: var(--stock); }
.tcg-status-card-icon.preorder { background: rgba(240,180,41,0.14); color: var(--preorder); }
.tcg-status-card-icon.ondemand { background: rgba(79,163,247,0.14); color: var(--ondemand); }
.tcg-status-card h3 { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.05em; margin: 0 0 8px; }
.tcg-status-card p { font-size: 13.5px; color: var(--parchment-dim); margin: 0; line-height: 1.55; }

/* ---- Notice / callout ---- */
.tcg-notice {
  display: flex; gap: 12px; align-items: flex-start; padding: 16px 18px; border-radius: var(--radius-md);
  background: var(--ink-2); border: 1px solid var(--ink-border); font-size: 14px; color: var(--parchment-dim); line-height: 1.55;
}
.tcg-notice.warn { background: rgba(240,180,41,0.08); border-color: rgba(240,180,41,0.3); color: #f6d998; }
.tcg-notice.error { background: rgba(239,83,80,0.08); border-color: rgba(239,83,80,0.3); color: #ffb3b0; }
.tcg-notice svg { flex-shrink: 0; margin-top: 1px; }
.tcg-notice strong { color: var(--parchment); }

/* ---- Section headers ---- */
.tcg-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.tcg-h2 { font-family: var(--font-display); font-size: clamp(24px, 3.5vw, 32px); font-weight: 700; margin: 0; }
.tcg-h3 { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin: 0 0 6px; }
.tcg-muted { color: var(--parchment-dim); }
.tcg-link-more { display: inline-flex; align-items: center; gap: 4px; font-weight: 600; color: var(--ember-1); font-size: 14px; background: none; border: none; }
.tcg-link-more:hover { color: var(--ember-2); }

/* ---- Category chips ---- */
.tcg-cat-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 28px 0 4px; }
.tcg-cat-chip { padding: 9px 18px; border-radius: var(--radius-pill); background: var(--ink-2); border: 1px solid var(--ink-border); font-size: 13.5px; font-weight: 600; }
.tcg-cat-chip:hover { border-color: var(--ember-1); color: var(--ember-1); }

/* ---- Product grid & card ("card sleeve") ---- */
.tcg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.tcg-card {
  background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg);
  overflow: hidden; display: flex; flex-direction: column; transition: transform .18s, border-color .18s, box-shadow .18s;
}
.tcg-card:hover { transform: translateY(-4px); border-color: var(--ink-border); box-shadow: var(--shadow); }
.tcg-card-media { position: relative; aspect-ratio: 1 / 1; background: var(--ink-3); overflow: hidden; }
.tcg-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tcg-card-badge { position: absolute; top: 12px; left: 12px; }
.tcg-card-body { padding: 16px 16px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.tcg-card-cat { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; color: var(--parchment-faint); text-transform: uppercase; }
.tcg-card-name { font-family: var(--font-display); font-size: 16.5px; font-weight: 600; line-height: 1.3; margin: 0; }
.tcg-card-desc { font-size: 13px; color: var(--parchment-dim); line-height: 1.5; flex: 1; }
.tcg-card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.tcg-price { font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: var(--parchment); }
.tcg-price small { font-weight: 500; color: var(--parchment-faint); font-size: 11px; }

.tcg-imgfallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--parchment-faint); flex-direction: column; gap: 6px; font-size: 12px; }

/* ---- Filters / search ---- */
.tcg-toolbar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
.tcg-search { position: relative; flex: 1; min-width: 220px; }
.tcg-search input { width: 100%; background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-pill); padding: 11px 16px 11px 42px; color: var(--parchment); font-size: 14.5px; }
.tcg-search input::placeholder { color: var(--parchment-faint); }
.tcg-search svg { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--parchment-faint); }
.tcg-filter-row { display: flex; gap: 8px; flex-wrap: wrap; }

/* ---- Empty state ---- */
.tcg-empty { text-align: center; padding: 70px 20px; color: var(--parchment-dim); }
.tcg-empty svg { color: var(--parchment-faint); margin-bottom: 14px; }
.tcg-empty h3 { font-family: var(--font-display); color: var(--parchment); margin: 0 0 8px; font-size: 19px; }

/* ---- Product detail ---- */
.tcg-breadcrumb { display: inline-flex; align-items: center; gap: 6px; color: var(--parchment-dim); font-size: 13.5px; margin-bottom: 24px; background: none; border: none; }
.tcg-breadcrumb:hover { color: var(--ember-1); }
.tcg-product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: flex-start; }
@media (max-width: 800px) { .tcg-product-grid { grid-template-columns: 1fr; gap: 28px; } }
.tcg-product-media { border-radius: var(--radius-lg); overflow: hidden; background: var(--ink-2); border: 1px solid var(--ink-border); aspect-ratio: 1/1; }
.tcg-product-media img { width: 100%; height: 100%; object-fit: cover; }
.tcg-product-cat { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.08em; color: var(--ember-1); text-transform: uppercase; margin-bottom: 10px; display: block; }
.tcg-product-title { font-family: var(--font-display); font-size: clamp(24px, 3.5vw, 34px); font-weight: 700; margin: 0 0 14px; line-height: 1.15; }
.tcg-product-price { font-family: var(--font-mono); font-size: 26px; font-weight: 700; margin: 14px 0 18px; }
.tcg-product-desc { color: var(--parchment-dim); line-height: 1.65; margin-bottom: 22px; white-space: pre-line; }
.tcg-qty-row { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.tcg-stepper { display: flex; align-items: center; border: 1px solid var(--ink-border); border-radius: var(--radius-pill); overflow: hidden; }
.tcg-stepper button { background: var(--ink-2); color: var(--parchment); border: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
.tcg-stepper button:hover { background: var(--ink-3); color: var(--ember-1); }
.tcg-stepper span { width: 44px; text-align: center; font-family: var(--font-mono); font-weight: 600; }
.tcg-date-callout { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 13px; color: var(--parchment); background: var(--ink-3); border: 1px solid var(--ink-border); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 18px; }

/* ---- Cart ---- */
.tcg-cart-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
.tcg-cart-item { display: grid; grid-template-columns: 74px 1fr auto; gap: 14px; align-items: center; background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-md); padding: 12px; }
.tcg-cart-thumb { width: 74px; height: 74px; border-radius: var(--radius-sm); overflow: hidden; background: var(--ink-3); flex-shrink: 0; }
.tcg-cart-thumb img { width: 100%; height: 100%; object-fit: cover; }
.tcg-cart-info h4 { font-family: var(--font-display); font-size: 15.5px; font-weight: 600; margin: 0 0 4px; }
.tcg-cart-item-actions { display: flex; align-items: center; gap: 16px; }
.tcg-cart-sub { font-family: var(--font-mono); font-weight: 700; font-size: 14.5px; min-width: 74px; text-align: right; }
.tcg-remove-btn { background: none; border: none; color: var(--parchment-faint); padding: 6px; }
.tcg-remove-btn:hover { color: var(--danger); }
.tcg-cart-summary { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg); padding: 22px; }
.tcg-summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14.5px; color: var(--parchment-dim); }
.tcg-summary-row.total { border-top: 1px solid var(--ink-border); margin-top: 8px; padding-top: 16px; font-size: 18px; color: var(--parchment); font-weight: 700; font-family: var(--font-mono); }

/* ---- Forms ---- */
.tcg-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .tcg-form-grid { grid-template-columns: 1fr; } }
.tcg-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.tcg-field label { font-size: 13px; font-weight: 600; color: var(--parchment-dim); }
.tcg-field .req { color: var(--ember-1); }
.tcg-input, .tcg-select, .tcg-textarea {
  background: var(--ink); border: 1px solid var(--ink-border); border-radius: var(--radius-sm);
  padding: 11px 14px; color: var(--parchment); font-size: 14.5px; width: 100%;
}
.tcg-input:focus, .tcg-select:focus, .tcg-textarea:focus { border-color: var(--ember-1); }
.tcg-textarea { resize: vertical; min-height: 80px; font-family: var(--font-body); }
.tcg-field-error { color: #ff8783; font-size: 12.5px; margin-top: 2px; }
.tcg-input.error, .tcg-select.error { border-color: var(--danger); }
.tcg-phone-row { display: grid; grid-template-columns: 168px 1fr; gap: 10px; }
@media (max-width: 460px) { .tcg-phone-row { grid-template-columns: 1fr; } }
.tcg-checkbox-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--parchment-dim); line-height: 1.5; }
.tcg-checkbox-row input { margin-top: 3px; accent-color: var(--ember-1); width: 16px; height: 16px; flex-shrink: 0; }
.tcg-hp-field { position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; overflow: hidden; }

/* ---- Confirmation ---- */
.tcg-confirm-icon { width: 68px; height: 68px; border-radius: 50%; background: rgba(61,214,140,0.14); color: var(--stock); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; }
.tcg-order-number { font-family: var(--font-mono); font-size: 22px; font-weight: 700; letter-spacing: 0.02em; background: var(--ink-2); border: 1px solid var(--ink-border); display: inline-block; padding: 10px 22px; border-radius: var(--radius-pill); margin: 6px 0 24px; }
.tcg-recap { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg); padding: 22px; text-align: left; margin: 22px 0; }
.tcg-recap h4 { font-family: var(--font-display); font-size: 15px; margin: 0 0 12px; color: var(--ember-1); }
.tcg-recap-line { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; color: var(--parchment-dim); border-bottom: 1px dashed var(--ink-border); }
.tcg-recap-line:last-child { border-bottom: none; }
.tcg-recap-line span:first-child { color: var(--parchment); }

/* ---- Footer ---- */
.tcg-footer { border-top: 1px solid var(--ink-border-soft); padding: 40px 0 26px; margin-top: 60px; }
.tcg-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 32px; margin-bottom: 28px; }
@media (max-width: 700px) { .tcg-footer-grid { grid-template-columns: 1fr; gap: 24px; } }
.tcg-footer h5 { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--parchment-faint); margin: 0 0 12px; }
.tcg-footer-links { display: flex; flex-direction: column; gap: 9px; }
.tcg-footer-links button, .tcg-footer-links a { background: none; border: none; text-align: left; color: var(--parchment-dim); font-size: 13.5px; padding: 0; }
.tcg-footer-links button:hover, .tcg-footer-links a:hover { color: var(--ember-1); }
.tcg-footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--ink-border-soft); font-size: 12.5px; color: var(--parchment-faint); flex-wrap: wrap; gap: 10px; }
.tcg-admin-link { opacity: 0.55; font-size: 12px; }
.tcg-admin-link:hover { opacity: 1; }

/* ---- Legal pages ---- */
.tcg-legal { max-width: 720px; }
.tcg-legal h2 { font-family: var(--font-display); font-size: 26px; margin: 28px 0 10px; }
.tcg-legal h2:first-child { margin-top: 0; }
.tcg-legal p, .tcg-legal li { color: var(--parchment-dim); line-height: 1.7; font-size: 14.5px; }
.tcg-legal ul { padding-left: 20px; }

/* ---- Admin ---- */
.tcg-admin-shell { min-height: 100vh; }
.tcg-admin-header { background: var(--ink-2); border-bottom: 1px solid var(--ink-border); padding: 16px 0; }
.tcg-admin-header-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1180px; margin: 0 auto; padding: 0 20px; flex-wrap: wrap; gap: 12px; }
.tcg-login-shell { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.tcg-login-card { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg); padding: 36px; max-width: 380px; width: 100%; text-align: center; }
.tcg-login-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--ink-3); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: var(--ember-1); }
.tcg-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--ink-border-soft); }
.tcg-tab { padding: 12px 6px; background: none; border: none; color: var(--parchment-dim); font-weight: 600; font-size: 14.5px; border-bottom: 2px solid transparent; display: flex; align-items: center; gap: 8px; margin-right: 18px; }
.tcg-tab.active { color: var(--ember-1); border-bottom-color: var(--ember-1); }
.tcg-admin-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.tcg-admin-card { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; }
.tcg-admin-card.hidden-item { opacity: 0.55; }
.tcg-admin-prod-row { display: grid; grid-template-columns: 56px 1fr auto; gap: 14px; align-items: center; }
.tcg-admin-thumb { width: 56px; height: 56px; border-radius: var(--radius-sm); overflow: hidden; background: var(--ink-3); flex-shrink: 0; }
.tcg-admin-thumb img { width: 100%; height: 100%; object-fit: cover; }
.tcg-admin-actions { display: flex; gap: 6px; }
.tcg-order-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; cursor: pointer; }
.tcg-order-meta { font-size: 13px; color: var(--parchment-dim); margin-top: 4px; }
.tcg-order-detail { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--ink-border); font-size: 13.5px; }
.tcg-order-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 600px) { .tcg-order-detail-grid { grid-template-columns: 1fr; } }
.tcg-order-detail dt { color: var(--parchment-faint); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 10px; font-family: var(--font-mono); }
.tcg-order-detail dd { margin: 2px 0 0; color: var(--parchment); }
.tcg-status-select { background: var(--ink); border: 1px solid var(--ink-border); color: var(--parchment); border-radius: var(--radius-pill); padding: 7px 14px; font-size: 13px; font-weight: 600; font-family: var(--font-mono); }

.tcg-modal-overlay { position: fixed; inset: 0; background: rgba(10,7,4,0.7); backdrop-filter: blur(3px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
.tcg-modal { background: var(--ink-2); border: 1px solid var(--ink-border); border-radius: var(--radius-lg); padding: 28px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; margin: auto; }
.tcg-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.tcg-img-preview { width: 100%; aspect-ratio: 16/9; border-radius: var(--radius-sm); overflow: hidden; background: var(--ink); border: 1px solid var(--ink-border); margin-top: 8px; }
.tcg-img-preview img { width: 100%; height: 100%; object-fit: cover; }
.tcg-translate-toggle { background: none; border: 1px dashed var(--ink-border); color: var(--parchment-dim); border-radius: var(--radius-md); padding: 10px 14px; font-size: 13.5px; width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between; margin: 6px 0 16px; }
.tcg-translate-toggle:hover { border-color: var(--ember-1); color: var(--parchment); }
.tcg-translate-block { border: 1px solid var(--ink-border-soft); border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px; }
.tcg-translate-block h5 { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ember-1); margin: 0 0 12px; }

.tcg-spin { animation: tcg-spin 1s linear infinite; }
@keyframes tcg-spin { to { transform: rotate(360deg); } }
.tcg-center-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 20px; color: var(--parchment-dim); gap: 12px; }

.tcg-legal-warning { display: flex; gap: 10px; background: rgba(240,180,41,0.1); border: 1px solid rgba(240,180,41,0.3); color: #f6d998; padding: 14px 16px; border-radius: var(--radius-md); font-size: 13.5px; margin-bottom: 24px; }
`;

/* ============================================================================
   HELPERS
   ========================================================================= */

function localeForLang(lang) {
  if (lang === "de") return "de-DE";
  if (lang === "en") return "en-IE"; // Engels + natuurlijke euro-notatie (€135.00)
  return "nl-NL";
}

function formatPrice(n, lang = "nl") {
  return new Intl.NumberFormat(localeForLang(lang), { style: "currency", currency: "EUR" }).format(
    Number(n) || 0
  );
}

function formatDateTime(iso, lang = "nl") {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : localeForLang(lang), {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function buildFullPhone(countryCode, localNumber) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const dial = country ? country.dial : "";
  const digits = String(localNumber || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  return `${dial} ${digits}`.trim();
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ============================================================================
   DATALAAG — alle toegang tot de backend loopt via deze functies.
   Migratie-opmerking t.o.v. de Claude-artifact-versie: `window.storage` is
   hier vervangen door fetch()-aanroepen naar de Netlify Functions in
   netlify/functions/ (die op hun beurt Netlify Blobs gebruiken). De rest van
   de app (alle componenten) blijft ongewijzigd — dat was precies het doel
   van deze laag-scheiding.
   ========================================================================= */

async function apiGetProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function apiSaveProducts(list, adminSecret) {
  try {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify(list),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiListOrders(adminSecret) {
  const res = await fetch("/api/orders", { headers: { "x-admin-secret": adminSecret } });
  if (!res.ok) {
    const err = new Error("orders_fetch_failed");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Maakt een nieuwe bestelling aan. Het bestelnummer en de aanmaakdatum worden
// door de server bepaald (zie netlify/functions/orders.mjs) — dat voorkomt
// dubbele bestelnummers bij gelijktijdige bestellingen, iets wat client-side
// niet waterdicht af te dwingen was.
async function apiCreateOrder(orderDraft) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderDraft),
  });
  if (!res.ok) throw new Error("order_create_failed");
  return res.json();
}

// Werkt alleen het e-mailstatus-veld bij; mag zonder adminSecret, want dit
// gebeurt direct na de eigen checkout-poging van de klant zelf.
async function apiUpdateOrderEmailStatus(orderNumber, emailStatus) {
  try {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, emailStatus }),
    });
  } catch {
    /* best effort, niet kritiek */
  }
}

async function apiUpdateOrderStatus(orderNumber, orderStatus, adminSecret) {
  const res = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
    body: JSON.stringify({ orderNumber, orderStatus }),
  });
  return res.ok;
}

// Taalvoorkeur is persoonlijk per bezoeker. Buiten de Claude-artifact-sandbox
// is localStorage hiervoor de juiste, standaard aanpak.
function loadSavedLang() {
  try {
    const saved = localStorage.getItem("preferred-lang");
    return saved && TRANSLATIONS[saved] ? saved : null;
  } catch {
    return null;
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem("preferred-lang", lang);
  } catch {
    /* niet kritiek als dit een keer mislukt, bv. privénavigatie */
  }
}

/* ============================================================================
   E-MAILLAAG — geïsoleerd zodat dit later eenvoudig te vervangen is door een
   eigen backend-mailservice. Gebruikt de EmailJS REST-API rechtstreeks via
   fetch(), zodat er geen extra script geladen hoeft te worden.
   De mail naar de shop + de mailto-fallback blijven bewust altijd in het
   Nederlands (OPERATIONAL_LANG), ongeacht de taal van de bezoeker.
   ========================================================================= */

const tOps = makeTranslator(OPERATIONAL_LANG);

function isEmailConfigured() {
  return (
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID" &&
    EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID" &&
    EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY"
  );
}

function formatItemsForEmail(items) {
  return items
    .map(
      (it) =>
        `- ${it.quantity}x ${it.name} [${tOps(`status_${it.status}_short`)}] — ${formatPrice(
          it.price * it.quantity,
          OPERATIONAL_LANG
        )}`
    )
    .join("\n");
}

async function sendOrderEmail(order) {
  if (!isEmailConfigured()) {
    return { status: "not_configured" };
  }
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        template_params: {
          to_email: SHOP_EMAIL,
          order_number: order.orderNumber,
          order_date: formatDateTime(order.createdAt, OPERATIONAL_LANG),
          customer_name: order.customer.name,
          customer_email: order.customer.email,
          customer_phone: order.customer.phoneFull,
          customer_address: `${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}, ${order.customer.country}`,
          customer_note: order.customer.note || "(geen opmerking)",
          order_items: formatItemsForEmail(order.items),
          order_total: formatPrice(order.total, OPERATIONAL_LANG),
          has_long_lead_items: order.items.some((it) => it.status !== "in_stock") ? "Ja" : "Nee",
          order_language: order.language || "nl",
        },
      }),
    });
    return { status: response.ok ? "sent" : "failed" };
  } catch {
    return { status: "failed" };
  }
}

function buildMailtoFallback(order) {
  const subject = encodeURIComponent(`Bestelling ${order.orderNumber} — ${SHOP_NAME}`);
  const lines = [
    `Bestelnummer: ${order.orderNumber}`,
    `Datum: ${formatDateTime(order.createdAt, OPERATIONAL_LANG)}`,
    "",
    "Producten:",
    ...order.items.map(
      (it) =>
        `- ${it.quantity}x ${it.name} [${tOps(`status_${it.status}_short`)}] — ${formatPrice(
          it.price * it.quantity,
          OPERATIONAL_LANG
        )}`
    ),
    "",
    `Totaal (indicatief): ${formatPrice(order.total, OPERATIONAL_LANG)}`,
    "",
    `Naam: ${order.customer.name}`,
    `E-mail: ${order.customer.email}`,
    `Telefoon: ${order.customer.phoneFull}`,
    `Adres: ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}, ${order.customer.country}`,
    order.customer.note ? `Opmerking: ${order.customer.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${SHOP_EMAIL}?subject=${subject}&body=${encodeURIComponent(lines)}`;
}

/* ============================================================================
   KLEINE HERBRUIKBARE COMPONENTEN
   ========================================================================= */

function StatusBadge({ status }) {
  const { t } = useT();
  const meta = statusLabel(status, t);
  return (
    <span className={`tcg-badge ${meta.cls}`}>
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  const { t } = useT();
  useEffect(() => {
    setFailed(false);
  }, [src]);
  // Inline width/height 100% zodat dit blok altijd de (relatief gepositioneerde,
  // vast-hoge) ouder vult, ongeacht welke className is meegegeven — dit voorkomt
  // dat de fallback-status in elkaar zakt wanneer er geen afbeelding is.
  if (!src || failed) {
    return (
      <div className={className} style={{ width: "100%", height: "100%" }}>
        <div className="tcg-imgfallback">
          <ImageOff size={26} />
          <span>{t("form_image_preview_empty")}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div className="tcg-center-loading">
      <Loader2 className="tcg-spin" size={28} />
      {label && <span>{label}</span>}
    </div>
  );
}

function DeliveryNotice({ compact }) {
  const { t } = useT();
  return (
    <div className="tcg-notice">
      <Info size={18} color="var(--ember-1)" />
      <div>{compact ? t("delivery_explainer_compact") : t("delivery_explainer_full")}</div>
    </div>
  );
}

function EmptyState({ icon, title, text, action }) {
  const Icon = icon || Package;
  return (
    <div className="tcg-empty">
      <Icon size={40} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

/* ============================================================================
   HEADER / FOOTER
   ========================================================================= */

function Header({ route, goTo, cartCount }) {
  const { t, lang, setLang } = useT();
  const isActive = (name) => route.name === name;
  return (
    <header className="tcg-header">
      <div className="tcg-header-inner">
        <button className="tcg-logo" onClick={() => goTo("home")} aria-label={t("nav_home")}>
          <span className="tcg-logo-mark">
            <Layers size={19} strokeWidth={2.4} />
          </span>
          <span className="tcg-logo-text">
            TCG <span>Haven</span>
          </span>
        </button>
        <nav className="tcg-nav">
          <button className={`tcg-nav-link ${isActive("home") ? "active" : ""}`} onClick={() => goTo("home")}>
            {t("nav_home")}
          </button>
          <button className={`tcg-nav-link ${isActive("catalog") ? "active" : ""}`} onClick={() => goTo("catalog")}>
            {t("nav_products")}
          </button>
        </nav>
        <div className="tcg-header-right">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Globe size={15} color="var(--parchment-faint)" />
            <select
              className="tcg-lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t("lang_label")}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>
          <button className="tcg-cart-btn" onClick={() => goTo("cart")} aria-label={t("nav_cart")}>
            <ShoppingCart size={17} />
            {t("nav_cart")}
            {cartCount > 0 && <span className="tcg-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ goTo, isAdminAuthenticated }) {
  const { t } = useT();
  return (
    <footer className="tcg-footer">
      <div className="tcg-container">
        <div className="tcg-footer-grid">
          <div>
            <span className="tcg-logo-text" style={{ fontSize: 18 }}>
              TCG <span>Haven</span>
            </span>
            <p className="tcg-muted" style={{ fontSize: 13.5, marginTop: 10, maxWidth: 360, lineHeight: 1.6 }}>
              {t("footer_tagline")}
            </p>
          </div>
          <div>
            <h5>{t("footer_shop_heading")}</h5>
            <div className="tcg-footer-links">
              <button onClick={() => goTo("home")}>{t("nav_home")}</button>
              <button onClick={() => goTo("catalog")}>{t("home_view_all")}</button>
              <button onClick={() => goTo("cart")}>{t("nav_cart")}</button>
            </div>
          </div>
          <div>
            <h5>{t("footer_info_heading")}</h5>
            <div className="tcg-footer-links">
              <button onClick={() => goTo("privacy")}>{t("privacy_title")}</button>
              <button onClick={() => goTo("terms")}>{t("terms_title")}</button>
              <button onClick={() => goTo("cookies")}>{t("cookies_title")}</button>
              <a href={`mailto:${SHOP_EMAIL}`}>{SHOP_EMAIL}</a>
            </div>
          </div>
        </div>
        <div className="tcg-footer-bottom">
          <span>{t("footer_bottom_note", { year: String(new Date().getFullYear()) })}</span>
          <button className="tcg-admin-link" onClick={() => goTo(isAdminAuthenticated ? "admin" : "admin-login")}>
            {t("footer_admin_link")}
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
   HOMEVIEW
   ========================================================================= */

function HomeView({ products, goTo, addToCart }) {
  const { t } = useT();
  const visible = products.filter((p) => p.visible);
  const featured = visible.slice(0, 4);
  const categories = [...new Set(visible.map((p) => p.category))];

  return (
    <>
      <section className="tcg-hero">
        <div className="tcg-container">
          <span className="tcg-eyebrow">{t("hero_eyebrow")}</span>
          <h1 className="tcg-h1">{t("hero_title")}</h1>
          <p className="tcg-lead">{t("hero_lead")}</p>
          <div className="tcg-hero-actions">
            <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("catalog")}>
              {t("hero_cta_catalog")} <ChevronRight size={17} />
            </button>
            <button className="tcg-btn tcg-btn-secondary" onClick={() => goTo("cart")}>
              <ShoppingCart size={16} /> {t("hero_cta_cart")}
            </button>
          </div>

          <div className="tcg-status-strip">
            <div className="tcg-status-card">
              <div className="tcg-status-card-icon stock">
                <Package size={19} />
              </div>
              <h3>{t("status_stock_card_title")}</h3>
              <p>{t("status_stock_card_desc")}</p>
            </div>
            <div className="tcg-status-card">
              <div className="tcg-status-card-icon preorder">
                <Clock size={19} />
              </div>
              <h3>{t("status_preorder_card_title")}</h3>
              <p>{t("status_preorder_card_desc")}</p>
            </div>
            <div className="tcg-status-card">
              <div className="tcg-status-card-icon ondemand">
                <Truck size={19} />
              </div>
              <h3>{t("status_ondemand_card_title")}</h3>
              <p>{t("status_ondemand_card_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tcg-section tight">
        <div className="tcg-container">
          <DeliveryNotice />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="tcg-section">
          <div className="tcg-container">
            <div className="tcg-section-head">
              <h2 className="tcg-h2">{t("home_featured_title")}</h2>
              <button className="tcg-link-more" onClick={() => goTo("catalog")}>
                {t("home_view_all")} <ChevronRight size={15} />
              </button>
            </div>
            <div className="tcg-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => goTo("product", { id: p.id })} onQuickAdd={addToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="tcg-section tight">
          <div className="tcg-container">
            <h2 className="tcg-h2">{t("home_categories_title")}</h2>
            <div className="tcg-cat-row">
              {categories.map((c) => (
                <button key={c} className="tcg-cat-chip" onClick={() => goTo("catalog", { category: c })}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ProductCard({ product, onOpen, onQuickAdd }) {
  const { t, lang } = useT();
  const [justAdded, setJustAdded] = useState(false);
  const name = resolveProductField(product, lang, "name");
  const shortDesc = resolveProductField(product, lang, "shortDescription");

  function handleQuickAdd(e) {
    e.stopPropagation();
    onQuickAdd(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <div className="tcg-card">
      <button onClick={onOpen} style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}>
        <div className="tcg-card-media">
          <ProductImage src={product.imageUrl} alt={name} className="tcg-card-media-inner" />
          <div className="tcg-card-badge">
            <StatusBadge status={product.status} />
          </div>
        </div>
      </button>
      <div className="tcg-card-body">
        <span className="tcg-card-cat">{product.category}</span>
        <h3 className="tcg-card-name">{name}</h3>
        <p className="tcg-card-desc">{shortDesc}</p>
        <div className="tcg-card-foot">
          <span className="tcg-price">{formatPrice(product.price, lang)}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={`tcg-btn-icon ${justAdded ? "added" : ""}`}
              onClick={handleQuickAdd}
              aria-label={t("card_quick_add")}
              title={t("card_quick_add")}
            >
              {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
            </button>
            <button className="tcg-btn tcg-btn-secondary tcg-btn-sm" onClick={onOpen}>
              {t("card_view_product")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   CATALOGVIEW
   ========================================================================= */

const ALL_FILTER = "__all__";

function CatalogView({ products, goTo, initialCategory, addToCart }) {
  const { t, lang } = useT();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || ALL_FILTER);
  const [status, setStatus] = useState(ALL_FILTER);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  const visible = products.filter((p) => p.visible);
  const categories = [ALL_FILTER, ...new Set(visible.map((p) => p.category))];

  const filtered = useMemo(() => {
    return visible.filter((p) => {
      if (category !== ALL_FILTER && p.category !== category) return false;
      if (status !== ALL_FILTER && p.status !== status) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const name = resolveProductField(p, lang, "name");
        const shortDesc = resolveProductField(p, lang, "shortDescription");
        const fullDesc = resolveProductField(p, lang, "fullDescription");
        const hay = `${name} ${shortDesc} ${fullDesc}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, category, status, search, lang]);

  return (
    <section className="tcg-section">
      <div className="tcg-container">
        <div className="tcg-section-head">
          <h2 className="tcg-h2">{t("catalog_title")}</h2>
        </div>

        <div style={{ marginBottom: 20 }}>
          <DeliveryNotice compact />
        </div>

        <div className="tcg-toolbar">
          <div className="tcg-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={t("catalog_search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="tcg-filter-row" style={{ marginBottom: 10 }}>
          {categories.map((c) => (
            <button key={c} className={`tcg-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
              {c === ALL_FILTER ? t("catalog_filter_all") : c}
            </button>
          ))}
        </div>
        <div className="tcg-filter-row" style={{ marginBottom: 28 }}>
          {[ALL_FILTER, "in_stock", "preorder", "on_demand"].map((s) => {
            const meta = s === ALL_FILTER ? null : statusLabel(s, t);
            return (
              <button key={s} className={`tcg-pill ${status === s ? "active" : ""}`} onClick={() => setStatus(s)}>
                {s === ALL_FILTER ? t("catalog_filter_all_status") : `${meta.emoji} ${meta.short}`}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Search} title={t("catalog_empty_title")} text={t("catalog_empty_text")} />
        ) : (
          <div className="tcg-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => goTo("product", { id: p.id })} onQuickAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
   PRODUCTVIEW
   ========================================================================= */

function ProductView({ product, goTo, addToCart }) {
  const { t, lang } = useT();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="tcg-section">
        <div className="tcg-container">
          <EmptyState
            icon={Package}
            title={t("product_not_found_title")}
            text={t("product_not_found_text")}
            action={
              <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("catalog")}>
                {t("product_back_to_all")}
              </button>
            }
          />
        </div>
      </section>
    );
  }

  const isLongLead = product.status !== "in_stock";
  const name = resolveProductField(product, lang, "name");
  const fullDesc = resolveProductField(product, lang, "fullDescription");
  const meta = statusLabel(product.status, t);

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <section className="tcg-section">
      <div className="tcg-container">
        <button className="tcg-breadcrumb" onClick={() => goTo("catalog")}>
          <ArrowLeft size={15} /> {t("product_back_to_catalog")}
        </button>
        <div className="tcg-product-grid">
          <ProductImage src={product.imageUrl} alt={name} className="tcg-product-media" />
          <div>
            <span className="tcg-product-cat">{product.category}</span>
            <h1 className="tcg-product-title">{name}</h1>
            <StatusBadge status={product.status} />
            <div className="tcg-product-price">{formatPrice(product.price, lang)}</div>

            {isLongLead && (product.expectedDate || product.deliveryNote) && (
              <div className="tcg-date-callout">
                <Clock size={15} color="var(--ember-1)" />
                {product.expectedDate || product.deliveryNote}
              </div>
            )}

            <p className="tcg-product-desc">{fullDesc}</p>

            {isLongLead ? (
              <div className="tcg-notice warn" style={{ marginBottom: 22 }}>
                <AlertTriangle size={18} />
                <div>
                  <strong>{t("product_longlead_title")}</strong>{" "}
                  {t("product_longlead_body", { status: meta.short.toLowerCase() })}
                  {product.deliveryNote ? ` ${product.deliveryNote}` : ""}
                </div>
              </div>
            ) : (
              <div className="tcg-notice" style={{ marginBottom: 22 }}>
                <Package size={18} color="var(--stock)" />
                <div>{t("product_in_stock_notice")}</div>
              </div>
            )}

            <div className="tcg-qty-row">
              <div className="tcg-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="-">
                  <Minus size={15} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="+">
                  <Plus size={15} />
                </button>
              </div>
              <button className="tcg-btn tcg-btn-primary" onClick={handleAdd}>
                <ShoppingCart size={17} /> {added ? t("product_added") : t("product_add_to_cart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CARTVIEW
   ========================================================================= */

function CartView({ cart, updateQty, removeFromCart, goTo, cartTotal }) {
  const { t, lang } = useT();
  const hasLongLead = cart.some((it) => it.status !== "in_stock");

  if (cart.length === 0) {
    return (
      <section className="tcg-section">
        <div className="tcg-container">
          <EmptyState
            icon={ShoppingCart}
            title={t("cart_empty_title")}
            text={t("cart_empty_text")}
            action={
              <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("catalog")}>
                {t("cart_browse")}
              </button>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="tcg-section">
      <div className="tcg-container" style={{ maxWidth: 760 }}>
        <h2 className="tcg-h2" style={{ marginBottom: 24 }}>
          {t("cart_title")}
        </h2>

        <div className="tcg-cart-list">
          {cart.map((item) => (
            <div className="tcg-cart-item" key={item.productId}>
              <div className="tcg-cart-thumb">
                <ProductImage src={item.imageUrl} alt={item.name} className="tcg-cart-thumb-inner" />
              </div>
              <div className="tcg-cart-info">
                <h4>{item.name}</h4>
                <StatusBadge status={item.status} />
                <div className="tcg-cart-item-actions" style={{ marginTop: 10 }}>
                  <div className="tcg-stepper">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} aria-label="-">
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} aria-label="+">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <span className="tcg-cart-sub">{formatPrice(item.price * item.quantity, lang)}</span>
                <button
                  className="tcg-remove-btn"
                  onClick={() => removeFromCart(item.productId)}
                  aria-label={t("admin_action_delete")}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasLongLead && (
          <div className="tcg-notice warn" style={{ marginBottom: 22 }}>
            <AlertTriangle size={18} />
            <div>{t("cart_warning")}</div>
          </div>
        )}

        <div className="tcg-cart-summary">
          <div className="tcg-summary-row">
            <span>{t("cart_item_count")}</span>
            <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="tcg-summary-row total">
            <span>{t("cart_total")}</span>
            <span>{formatPrice(cartTotal, lang)}</span>
          </div>
        </div>
        <p className="tcg-muted" style={{ fontSize: 12.5, marginTop: 10 }}>
          {t("cart_no_payment_note")}
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <button className="tcg-btn tcg-btn-secondary" onClick={() => goTo("catalog")}>
            {t("cart_continue_shopping")}
          </button>
          <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("checkout")}>
            {t("cart_place_order")} <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CHECKOUTVIEW
   ========================================================================= */

const INITIAL_CHECKOUT_FORM = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  country: "NL",
  phoneCountry: "NL",
  phoneNumber: "",
  email: "",
  note: "",
  consent: false,
  website: "", // honeypot — moet leeg blijven
};

function validateCheckoutForm(data, t) {
  const errors = {};
  if (!data.name.trim()) errors.name = t("err_name");
  if (!data.address.trim()) errors.address = t("err_address");
  if (!data.postalCode.trim()) errors.postalCode = t("err_postal");
  if (!data.city.trim()) errors.city = t("err_city");
  if (!data.country) errors.country = t("err_country");
  if (!data.phoneNumber.trim()) errors.phoneNumber = t("err_phone_required");
  else if (data.phoneNumber.replace(/\D/g, "").length < 6) errors.phoneNumber = t("err_phone_invalid");
  if (!data.email.trim()) errors.email = t("err_email_required");
  else if (!isValidEmail(data.email)) errors.email = t("err_email_invalid");
  if (!data.consent) errors.consent = t("err_consent");
  return errors;
}

function CheckoutView({ cart, cartTotal, goTo, onSubmitOrder, submitting, submitError }) {
  const { t, lang } = useT();
  const [form, setForm] = useState(INITIAL_CHECKOUT_FORM);
  const [errors, setErrors] = useState({});
  const hasLongLead = cart.some((it) => it.status !== "in_stock");

  if (cart.length === 0) {
    return (
      <section className="tcg-section">
        <div className="tcg-container">
          <EmptyState
            icon={ShoppingCart}
            title={t("cart_empty_title")}
            text={t("cart_empty_text")}
            action={
              <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("catalog")}>
                {t("cart_browse")}
              </button>
            }
          />
        </div>
      </section>
    );
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (form.website) return; // stille anti-spam block (honeypot)
    const foundErrors = validateCheckoutForm(form, t);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;
    onSubmitOrder(form);
  }

  return (
    <section className="tcg-section">
      <div className="tcg-container" style={{ maxWidth: 760 }}>
        <button className="tcg-breadcrumb" onClick={() => goTo("cart")}>
          <ArrowLeft size={15} /> {t("checkout_back_to_cart")}
        </button>
        <h2 className="tcg-h2" style={{ marginBottom: 6 }}>
          {t("checkout_title")}
        </h2>
        <p className="tcg-muted" style={{ marginBottom: 26, fontSize: 14.5 }}>
          {t("checkout_subtitle")}
        </p>

        {hasLongLead && (
          <div className="tcg-notice warn" style={{ marginBottom: 24 }}>
            <AlertTriangle size={18} />
            <div>{t("checkout_longlead_warning")}</div>
          </div>
        )}

        <div>
          <div className="tcg-field">
            <label>
              {t("field_name")} <span className="req">*</span>
            </label>
            <input
              className={`tcg-input ${errors.name ? "error" : ""}`}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder={t("field_name_placeholder")}
            />
            {errors.name && <span className="tcg-field-error">{errors.name}</span>}
          </div>

          <div className="tcg-field">
            <label>
              {t("field_address")} <span className="req">*</span>
            </label>
            <input
              className={`tcg-input ${errors.address ? "error" : ""}`}
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder={t("field_address_placeholder")}
            />
            {errors.address && <span className="tcg-field-error">{errors.address}</span>}
          </div>

          <div className="tcg-form-grid">
            <div className="tcg-field">
              <label>
                {t("field_postal")} <span className="req">*</span>
              </label>
              <input
                className={`tcg-input ${errors.postalCode ? "error" : ""}`}
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
              />
              {errors.postalCode && <span className="tcg-field-error">{errors.postalCode}</span>}
            </div>
            <div className="tcg-field">
              <label>
                {t("field_city")} <span className="req">*</span>
              </label>
              <input
                className={`tcg-input ${errors.city ? "error" : ""}`}
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              {errors.city && <span className="tcg-field-error">{errors.city}</span>}
            </div>
          </div>

          <div className="tcg-field">
            <label>
              {t("field_country")} <span className="req">*</span>
            </label>
            <select
              className="tcg-select"
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="tcg-field">
            <label>
              {t("field_phone")} <span className="req">*</span>
            </label>
            <div className="tcg-phone-row">
              <select
                className="tcg-select"
                value={form.phoneCountry}
                onChange={(e) => setField("phoneCountry", e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                className={`tcg-input ${errors.phoneNumber ? "error" : ""}`}
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value)}
                placeholder={t("field_phone_placeholder")}
                type="tel"
              />
            </div>
            <span className="tcg-muted" style={{ fontSize: 12 }}>
              {t("field_phone_hint")}
            </span>
            {errors.phoneNumber && <span className="tcg-field-error">{errors.phoneNumber}</span>}
          </div>

          <div className="tcg-field">
            <label>
              {t("field_email")} <span className="req">*</span>
            </label>
            <input
              className={`tcg-input ${errors.email ? "error" : ""}`}
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder={t("field_email_placeholder")}
              type="email"
            />
            {errors.email && <span className="tcg-field-error">{errors.email}</span>}
          </div>

          <div className="tcg-field">
            <label>{t("field_note")}</label>
            <textarea
              className="tcg-textarea"
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
              placeholder={t("field_note_placeholder")}
            />
          </div>

          {/* Honeypot-veld: onzichtbaar voor mensen, lokt spam-bots */}
          <div className="tcg-hp-field" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setField("website", e.target.value)}
            />
          </div>

          <div className="tcg-recap" style={{ marginBottom: 20 }}>
            <h4>{t("checkout_summary_title")}</h4>
            {cart.map((item) => (
              <div className="tcg-recap-line" key={item.productId}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity, lang)}</span>
              </div>
            ))}
            <div className="tcg-recap-line" style={{ fontWeight: 700 }}>
              <span>{t("cart_total")}</span>
              <span>{formatPrice(cartTotal, lang)}</span>
            </div>
          </div>

          <label className="tcg-checkbox-row" style={{ marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setField("consent", e.target.checked)}
            />
            <span>
              {t("checkout_consent_pre")}{" "}
              <button type="button" className="tcg-link-more" style={{ fontSize: "inherit" }} onClick={() => goTo("terms")}>
                {t("checkout_terms_link")}
              </button>{" "}
              {t("checkout_and")}{" "}
              <button type="button" className="tcg-link-more" style={{ fontSize: "inherit" }} onClick={() => goTo("privacy")}>
                {t("checkout_privacy_link")}
              </button>
              {t("checkout_consent_post")} <span className="req">*</span>
            </span>
          </label>
          {errors.consent && <span className="tcg-field-error">{errors.consent}</span>}

          {submitError && (
            <div className="tcg-notice error" style={{ margin: "18px 0" }}>
              <AlertTriangle size={18} />
              <div>{submitError}</div>
            </div>
          )}

          <button className="tcg-btn tcg-btn-primary tcg-btn-block" type="button" onClick={handleSubmit} disabled={submitting} style={{ marginTop: 18 }}>
            {submitting ? (
              <>
                <Loader2 className="tcg-spin" size={17} /> {t("checkout_submitting")}
              </>
            ) : (
              <>
                <Send size={16} /> {t("checkout_submit")}
              </>
            )}
          </button>
          <p className="tcg-muted" style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
            {t("checkout_submit_note")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CONFIRMATIONVIEW
   ========================================================================= */

function ConfirmationView({ order, goTo }) {
  const { t, lang } = useT();

  if (!order) {
    return (
      <section className="tcg-section">
        <div className="tcg-container">
          <EmptyState
            icon={Package}
            title={t("confirm_not_found_title")}
            text={t("confirm_not_found_text")}
            action={
              <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("home")}>
                {t("confirm_home")}
              </button>
            }
          />
        </div>
      </section>
    );
  }

  const hasLongLead = order.items.some((it) => it.status !== "in_stock");

  return (
    <section className="tcg-section">
      <div className="tcg-container" style={{ maxWidth: 640, textAlign: "center" }}>
        <div className="tcg-confirm-icon">
          <CheckCircle2 size={34} />
        </div>
        <h2 className="tcg-h2">{t("confirm_title")}</h2>
        <p className="tcg-muted" style={{ margin: "12px 0" }}>
          {t("confirm_received")}
        </p>
        <div className="tcg-order-number">{order.orderNumber}</div>

        {hasLongLead && (
          <div className="tcg-notice warn" style={{ textAlign: "left", marginBottom: 10 }}>
            <AlertTriangle size={18} />
            <div>{t("confirm_longlead")}</div>
          </div>
        )}

        <div className="tcg-recap">
          <h4>{t("confirm_items_title")}</h4>
          {order.items.map((item) => (
            <div className="tcg-recap-line" key={item.productId}>
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatPrice(item.price * item.quantity, lang)}</span>
            </div>
          ))}
          <div className="tcg-recap-line" style={{ fontWeight: 700 }}>
            <span>{t("cart_total")}</span>
            <span>{formatPrice(order.total, lang)}</span>
          </div>
        </div>

        <div className="tcg-recap">
          <h4>{t("confirm_details_title")}</h4>
          <div className="tcg-recap-line">
            <span>{t("field_name")}</span>
            <span>{order.customer.name}</span>
          </div>
          <div className="tcg-recap-line">
            <span>{t("field_email")}</span>
            <span>{order.customer.email}</span>
          </div>
          <div className="tcg-recap-line">
            <span>{t("field_phone")}</span>
            <span>{order.customer.phoneFull}</span>
          </div>
          <div className="tcg-recap-line">
            <span>{t("field_address")}</span>
            <span style={{ textAlign: "right" }}>
              {order.customer.address}, {order.customer.postalCode} {order.customer.city}
            </span>
          </div>
        </div>

        <div className="tcg-notice" style={{ textAlign: "left" }}>
          <Info size={18} color="var(--ember-1)" />
          <div>{t("confirm_no_payment")}</div>
        </div>

        {order.emailStatus !== "sent" && (
          <div className="tcg-notice" style={{ textAlign: "left", marginTop: 14 }}>
            <Mail size={18} color="var(--ember-1)" />
            <div>
              {t("confirm_email_fallback_pre")}{" "}
              <a href={buildMailtoFallback(order)} style={{ color: "var(--ember-1)", fontWeight: 600 }}>
                {t("confirm_email_fallback_link")}
              </a>
              .
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
          <button className="tcg-btn tcg-btn-secondary" onClick={() => goTo("catalog")}>
            {t("confirm_continue_shopping")}
          </button>
          <button className="tcg-btn tcg-btn-primary" onClick={() => goTo("home")}>
            {t("confirm_home")}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   JURIDISCHE CONCEPTPAGINA'S
   Let op: dit zijn conceptteksten, geschreven om de vereiste onderwerpen te
   dekken. Laat ze vóór livegang controleren door een jurist.
   ========================================================================= */

// Zet een {email}-placeholder in vertaalde tekst om in een echte mailto-link,
// zonder de vertaling zelf op te knippen in losse zinnetjes per taal.
function TextWithEmailLink({ text }) {
  const parts = text.split("{email}");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <a href={`mailto:${SHOP_EMAIL}`} style={{ color: "var(--ember-1)" }}>
        {SHOP_EMAIL}
      </a>
      {parts[1]}
    </>
  );
}

function LegalShell({ icon: Icon, title, children }) {
  const { t } = useT();
  return (
    <section className="tcg-section">
      <div className="tcg-container tcg-legal">
        <div className="tcg-legal-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>{t("legal_draft_warning_title")}</strong> {t("legal_draft_warning_text")}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Icon size={22} color="var(--ember-1)" />
          <h1 className="tcg-h2" style={{ margin: 0 }}>
            {title}
          </h1>
        </div>
        {children}
      </div>
    </section>
  );
}

function PrivacyView() {
  const { t } = useT();
  return (
    <LegalShell icon={ShieldCheck} title={t("privacy_title")}>
      <h2>{t("privacy_h_data")}</h2>
      <p>{t("privacy_p_data")}</p>
      <h2>{t("privacy_h_why")}</h2>
      <p>{t("privacy_p_why")}</p>
      <h2>{t("privacy_h_retention")}</h2>
      <p>{t("privacy_p_retention")}</p>
      <h2>{t("privacy_h_sharing")}</h2>
      <p>{t("privacy_p_sharing")}</p>
      <h2>{t("privacy_h_rights")}</h2>
      <p>
        <TextWithEmailLink text={t("privacy_p_rights")} />
      </p>
      <h2>{t("privacy_h_security")}</h2>
      <p>{t("privacy_p_security")}</p>
      <h2>{t("privacy_h_contact")}</h2>
      <p>
        <TextWithEmailLink text={t("privacy_p_contact")} />
      </p>
    </LegalShell>
  );
}

function TermsView() {
  const { t } = useT();
  return (
    <LegalShell icon={FileText} title={t("terms_title")}>
      <h2>{t("terms_h1")}</h2>
      <p>{t("terms_p1", { shop: SHOP_NAME })}</p>
      <h2>{t("terms_h2")}</h2>
      <p>{t("terms_p2", { shop: SHOP_NAME })}</p>
      <h2>{t("terms_h3")}</h2>
      <p>{t("terms_p3")}</p>
      <h2>{t("terms_h4")}</h2>
      <p>{t("terms_p4")}</p>
      <h2>{t("terms_h5")}</h2>
      <p>{t("terms_p5")}</p>
      <h2>{t("terms_h6")}</h2>
      <p>
        <TextWithEmailLink text={t("terms_p6")} />
      </p>
      <h2>{t("terms_h7")}</h2>
      <p>{t("terms_p7", { shop: SHOP_NAME })}</p>
      <h2>{t("terms_h8")}</h2>
      <p>
        <TextWithEmailLink text={t("terms_p8")} />
      </p>
    </LegalShell>
  );
}

function CookiesView() {
  const { t } = useT();
  return (
    <LegalShell icon={Cookie} title={t("cookies_title")}>
      <h2>{t("cookies_h_none")}</h2>
      <p>{t("cookies_p_none")}</p>
      <h2>{t("cookies_h_functional")}</h2>
      <p>{t("cookies_p_functional")}</p>
      <h2>{t("cookies_h_contact")}</h2>
      <p>
        <TextWithEmailLink text={t("cookies_p_contact")} />
      </p>
    </LegalShell>
  );
}

/* ============================================================================
   TAALKIEZER (compacte variant voor gebruik in admin)
   ========================================================================= */

function LangSwitchCompact() {
  const { t, lang, setLang } = useT();
  return (
    <select className="tcg-lang-select" value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t("lang_label")}>
      {SUPPORTED_LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
}

/* ============================================================================
   ADMIN — INLOG
   ========================================================================= */

function AdminLoginView({ onLogin, goTo }) {
  const { t } = useT();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit() {
    if (!code || checking) return;
    setChecking(true);
    setError("");
    const result = await onLogin(code); // { ok: true } of { ok: false, message }
    setChecking(false);
    if (!result.ok) {
      setError(result.message || t("admin_login_error"));
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="tcg-login-shell" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <LangSwitchCompact />
      </div>
      <div className="tcg-login-card">
        <div className="tcg-login-icon">
          <Lock size={22} />
        </div>
        <h2 className="tcg-h3">{t("admin_login_title")}</h2>
        <p className="tcg-muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
          {t("admin_login_subtitle")}
        </p>
        <div className="tcg-field" style={{ textAlign: "left" }}>
          <input
            className={`tcg-input ${error ? "error" : ""}`}
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("admin_login_placeholder")}
            autoFocus
          />
          {error && <span className="tcg-field-error">{error}</span>}
        </div>
        <button
          className="tcg-btn tcg-btn-primary tcg-btn-block"
          type="button"
          onClick={handleSubmit}
          disabled={checking}
        >
          {checking ? <Loader2 className="tcg-spin" size={16} /> : t("admin_login_button")}
        </button>
        <button
          type="button"
          className="tcg-btn tcg-btn-ghost tcg-btn-block"
          onClick={() => goTo("home")}
          style={{ marginTop: 8 }}
        >
          {t("admin_back_to_site")}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN — PRODUCTFORMULIER (modal, met optionele vertalingen)
   ========================================================================= */

const EMPTY_PRODUCT_FORM = {
  id: null,
  name: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  status: "in_stock",
  expectedDate: "",
  deliveryNote: "",
  imageUrl: "",
  visible: true,
  translations: {},
};

function ProductFormModal({ initial, categories, onSave, onClose, adminSecret }) {
  const { t } = useT();
  const [form, setForm] = useState(() => ({
    ...EMPTY_PRODUCT_FORM,
    ...(initial || {}),
    translations: {
      en: { shortDescription: "", fullDescription: "", ...((initial && initial.translations && initial.translations.en) || {}) },
      de: { shortDescription: "", fullDescription: "", ...((initial && initial.translations && initial.translations.de) || {}) },
    },
  }));
  const [imgFailed, setImgFailed] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const [showTranslations, setShowTranslations] = useState(
    Boolean(
      (initial &&
        initial.translations &&
        initial.translations.en &&
        (initial.translations.en.shortDescription || initial.translations.en.fullDescription)) ||
        (initial &&
          initial.translations &&
          initial.translations.de &&
          (initial.translations.de.shortDescription || initial.translations.de.fullDescription))
    )
  );

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // zelfde bestand nogmaals kunnen kiezen
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": file.type, "x-admin-secret": adminSecret },
        body: file,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload mislukt");
      }
      const data = await res.json();
      setField("imageUrl", data.url);
      setImgFailed(false);
    } catch (err) {
      setUploadError(err.message || "Upload mislukt");
    } finally {
      setUploading(false);
    }
  }

  function setTranslationField(langCode, field, value) {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langCode]: { ...prev.translations[langCode], [field]: value },
      },
    }));
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      setError(t("form_error_required"));
      return;
    }
    onSave({ ...form, price: Number(form.price) });
  }

  return (
    <div className="tcg-modal-overlay" onClick={onClose}>
      <div className="tcg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tcg-modal-head">
          <h3 className="tcg-h3" style={{ margin: 0 }}>
            {form.id ? t("form_edit_title") : t("form_new_title")}
          </h3>
          <button className="tcg-btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div>
          <div className="tcg-field">
            <label>
              {t("form_field_name")} <span className="req">*</span>
            </label>
            <input className="tcg-input" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>

          <div className="tcg-form-grid">
            <div className="tcg-field">
              <label>
                {t("form_field_category")} <span className="req">*</span>
              </label>
              <input
                className="tcg-input"
                list="tcg-category-options"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />
              <datalist id="tcg-category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="tcg-field">
              <label>
                {t("form_field_price")} <span className="req">*</span>
              </label>
              <input
                className="tcg-input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
          </div>

          <div className="tcg-field">
            <label>{t("form_field_short_desc")}</label>
            <input
              className="tcg-input"
              value={form.shortDescription}
              onChange={(e) => setField("shortDescription", e.target.value)}
              placeholder={t("form_field_short_desc_placeholder")}
            />
          </div>

          <div className="tcg-field">
            <label>{t("form_field_full_desc")}</label>
            <textarea
              className="tcg-textarea"
              value={form.fullDescription}
              onChange={(e) => setField("fullDescription", e.target.value)}
            />
          </div>

          <div className="tcg-field">
            <label>{t("form_field_status")}</label>
            <select className="tcg-select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
              <option value="in_stock">{t("form_status_in_stock")}</option>
              <option value="preorder">{t("form_status_preorder")}</option>
              <option value="on_demand">{t("form_status_on_demand")}</option>
            </select>
          </div>

          <div className="tcg-form-grid">
            <div className="tcg-field">
              <label>{t("form_field_expected_date")}</label>
              <input
                className="tcg-input"
                value={form.expectedDate}
                onChange={(e) => setField("expectedDate", e.target.value)}
                placeholder={t("form_field_expected_date_placeholder")}
              />
            </div>
            <div className="tcg-field">
              <label>{t("form_field_delivery_note")}</label>
              <input
                className="tcg-input"
                value={form.deliveryNote}
                onChange={(e) => setField("deliveryNote", e.target.value)}
              />
            </div>
          </div>

          <div className="tcg-field">
            <label>{t("form_field_image_url")}</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="tcg-input"
                value={form.imageUrl}
                onChange={(e) => {
                  setField("imageUrl", e.target.value);
                  setImgFailed(false);
                }}
                placeholder="https://..."
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="tcg-btn tcg-btn-secondary tcg-btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ whiteSpace: "nowrap" }}
              >
                {uploading ? <Loader2 className="tcg-spin" size={15} /> : <Upload size={15} />}
                {uploading ? t("form_image_uploading") : t("form_image_upload_btn")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
            <span className="tcg-muted" style={{ fontSize: 12 }}>
              {t("form_image_help")}
            </span>
            {uploadError && <span className="tcg-field-error">{uploadError}</span>}
            <div className="tcg-img-preview">
              {form.imageUrl && !imgFailed ? (
                <img src={form.imageUrl} alt="Preview" onError={() => setImgFailed(true)} />
              ) : (
                <div className="tcg-imgfallback">
                  <ImageOff size={22} />
                  <span>{form.imageUrl ? t("form_image_preview_fail") : t("form_image_preview_empty")}</span>
                </div>
              )}
            </div>
          </div>

          <button type="button" className="tcg-translate-toggle" onClick={() => setShowTranslations((s) => !s)}>
            <span>{t("form_translations_toggle")}</span>
            <ChevronDown size={16} style={{ transform: showTranslations ? "rotate(180deg)" : "none" }} />
          </button>

          {showTranslations && (
            <div style={{ marginBottom: 6 }}>
              <p className="tcg-muted" style={{ fontSize: 12.5, marginTop: -8, marginBottom: 14 }}>
                {t("form_translations_hint")}
              </p>
              {["en", "de"].map((langCode) => (
                <div className="tcg-translate-block" key={langCode}>
                  <h5>{t(langCode === "en" ? "form_lang_section_en" : "form_lang_section_de")}</h5>
                  <div className="tcg-field">
                    <label>{t("form_field_short_desc")}</label>
                    <input
                      className="tcg-input"
                      value={form.translations[langCode]?.shortDescription || ""}
                      onChange={(e) => setTranslationField(langCode, "shortDescription", e.target.value)}
                    />
                  </div>
                  <div className="tcg-field" style={{ marginBottom: 0 }}>
                    <label>{t("form_field_full_desc")}</label>
                    <textarea
                      className="tcg-textarea"
                      value={form.translations[langCode]?.fullDescription || ""}
                      onChange={(e) => setTranslationField(langCode, "fullDescription", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="tcg-checkbox-row" style={{ margin: "16px 0" }}>
            <input type="checkbox" checked={form.visible} onChange={(e) => setField("visible", e.target.checked)} />
            <span>{t("form_field_visible")}</span>
          </label>

          {error && (
            <div className="tcg-notice error" style={{ marginBottom: 16 }}>
              <AlertTriangle size={16} />
              <div>{error}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="tcg-btn tcg-btn-secondary" onClick={onClose}>
              {t("form_cancel")}
            </button>
            <button type="button" className="tcg-btn tcg-btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
              {t("form_save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN — DASHBOARD
   ========================================================================= */

function AdminHeader({ goTo, onLogout }) {
  const { t } = useT();
  return (
    <div className="tcg-admin-header">
      <div className="tcg-admin-header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="tcg-logo-mark">
            <Layers size={18} strokeWidth={2.4} />
          </span>
          <span className="tcg-logo-text" style={{ fontSize: 17 }}>
            {t("admin_header_title")}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <LangSwitchCompact />
          <button className="tcg-btn tcg-btn-secondary tcg-btn-sm" onClick={() => goTo("home")}>
            {t("admin_view_site")}
          </button>
          <button className="tcg-btn tcg-btn-secondary tcg-btn-sm" onClick={onLogout}>
            <LogOut size={14} /> {t("admin_logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminProductsTab({ products, categories, onSave, onDelete, onToggleVisible, adminSecret }) {
  const { t, lang } = useT();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(product) {
    setEditing(product);
    setShowForm(true);
  }
  function handleSave(data) {
    onSave(data);
    setShowForm(false);
  }

  return (
    <div>
      <div className="tcg-admin-row">
        <h3 className="tcg-h3" style={{ margin: 0 }}>
          {t("admin_products_heading", { count: String(products.length) })}
        </h3>
        <button className="tcg-btn tcg-btn-primary tcg-btn-sm" onClick={openNew}>
          <Plus size={15} /> {t("admin_new_product")}
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState icon={Boxes} title={t("admin_no_products_title")} text={t("admin_no_products_text")} />
      ) : (
        products.map((p) => {
          const name = resolveProductField(p, lang, "name");
          return (
            <div key={p.id} className={`tcg-admin-card ${!p.visible ? "hidden-item" : ""}`}>
              <div className="tcg-admin-prod-row">
                <div className="tcg-admin-thumb">
                  <ProductImage src={p.imageUrl} alt={name} className="tcg-admin-thumb-inner" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong>{name}</strong>
                    <StatusBadge status={p.status} />
                    {!p.visible && (
                      <span className="tcg-muted" style={{ fontSize: 12 }}>
                        {t("admin_hidden_suffix")}
                      </span>
                    )}
                  </div>
                  <div className="tcg-muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {p.category} · {formatPrice(p.price, lang)}
                  </div>
                </div>
                <div className="tcg-admin-actions">
                  <button
                    className="tcg-btn-icon"
                    onClick={() => onToggleVisible(p.id)}
                    title={p.visible ? t("admin_action_hide") : t("admin_action_show")}
                  >
                    {p.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button className="tcg-btn-icon" onClick={() => openEdit(p)} title={t("admin_action_edit")}>
                    <Pencil size={16} />
                  </button>
                  <button className="tcg-btn-icon" onClick={() => onDelete(p)} title={t("admin_action_delete")}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {showForm && (
        <ProductFormModal
          initial={editing}
          categories={categories}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
          adminSecret={adminSecret}
        />
      )}
    </div>
  );
}

function AdminOrdersTab({ orders, loading, onUpdateStatus, onRefresh }) {
  const { t, lang } = useT();
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const filtered = statusFilter === ALL_FILTER ? orders : orders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div>
      <div className="tcg-admin-row">
        <h3 className="tcg-h3" style={{ margin: 0 }}>
          {t("admin_orders_heading", { count: String(orders.length) })}
        </h3>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select className="tcg-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value={ALL_FILTER}>{t("admin_status_filter_all")}</option>
            {ORDER_STATUS_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`order_status_${code}`)}
              </option>
            ))}
          </select>
          <button className="tcg-btn-icon" onClick={onRefresh} title={t("admin_refresh_label")}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner label={t("admin_orders_loading")} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title={t("admin_orders_empty_title")} text={t("admin_orders_empty_text")} />
      ) : (
        filtered.map((o) => (
          <div key={o.orderNumber} className="tcg-admin-card">
            <div
              className="tcg-order-head"
              onClick={() => setExpanded(expanded === o.orderNumber ? null : o.orderNumber)}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontFamily: "var(--font-mono)" }}>{o.orderNumber}</strong>
                  {o.emailStatus === "sent" ? (
                    <span className="tcg-muted" style={{ fontSize: 12 }} title={t("admin_email_sent")}>
                      <Mail size={12} style={{ verticalAlign: "-2px" }} /> {t("admin_email_sent")}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--preorder)" }} title={t("admin_email_check")}>
                      <Mail size={12} style={{ verticalAlign: "-2px" }} /> {t("admin_email_check")}
                    </span>
                  )}
                </div>
                <div className="tcg-order-meta">
                  {o.customer.name} · {formatDateTime(o.createdAt, lang)} · {formatPrice(o.total, lang)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }} onClick={(e) => e.stopPropagation()}>
                <select
                  className="tcg-status-select"
                  value={o.orderStatus}
                  onChange={(e) => onUpdateStatus(o.orderNumber, e.target.value)}
                >
                  {ORDER_STATUS_CODES.map((code) => (
                    <option key={code} value={code}>
                      {t(`order_status_${code}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expanded === o.orderNumber ? "rotate(180deg)" : "none",
                    transition: "transform .15s",
                  }}
                />
              </div>
            </div>

            {expanded === o.orderNumber && (
              <div className="tcg-order-detail">
                <div className="tcg-order-detail-grid">
                  <dl>
                    <dt>{t("admin_detail_customer")}</dt>
                    <dd>{o.customer.name}</dd>
                    <dt>{t("admin_detail_email")}</dt>
                    <dd>{o.customer.email}</dd>
                    <dt>{t("admin_detail_phone")}</dt>
                    <dd>{o.customer.phoneFull}</dd>
                    <dt>{t("admin_detail_address")}</dt>
                    <dd>
                      {o.customer.address}, {o.customer.postalCode} {o.customer.city}, {o.customer.country}
                    </dd>
                    {o.customer.note && (
                      <>
                        <dt>{t("admin_detail_note")}</dt>
                        <dd>{o.customer.note}</dd>
                      </>
                    )}
                  </dl>
                  <dl>
                    <dt>{t("admin_detail_products")}</dt>
                    {o.items.map((it, i) => {
                      const meta = statusLabel(it.status, t);
                      return (
                        <dd key={i}>
                          {it.quantity}x {it.name} — {meta.short} — {formatPrice(it.price * it.quantity, lang)}
                        </dd>
                      );
                    })}
                    <dt>{t("admin_detail_total")}</dt>
                    <dd style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{formatPrice(o.total, lang)}</dd>
                  </dl>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AdminInviteTab() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("NL");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shopUrl, setShopUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : "https://tcghaven.nl"
  );
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const namePart = name.trim() ? ` ${name.trim()}` : "";
  const effectiveMessage =
    message.trim() || t("invite_default_message", { name: namePart, url: shopUrl.trim() || "https://tcghaven.nl" });

  const digits = buildFullPhone(phoneCountry, phoneNumber).replace(/\D/g, "");
  const waLink = digits ? `https://wa.me/${digits}?text=${encodeURIComponent(effectiveMessage)}` : "";

  function handleCopy() {
    if (!waLink) return;
    navigator.clipboard?.writeText(waLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h3 className="tcg-h3">{t("invite_title")}</h3>
      <p className="tcg-muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
        {t("invite_subtitle")}
      </p>

      <div className="tcg-field">
        <label>{t("invite_field_name")}</label>
        <input
          className="tcg-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("invite_field_name_placeholder")}
        />
      </div>

      <div className="tcg-field">
        <label>{t("invite_field_phone")}</label>
        <div className="tcg-phone-row">
          <select className="tcg-select" value={phoneCountry} onChange={(e) => setPhoneCountry(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <input
            className="tcg-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t("field_phone_placeholder")}
            type="tel"
          />
        </div>
      </div>

      <div className="tcg-field">
        <label>{t("invite_field_shop_url")}</label>
        <input
          className="tcg-input"
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
          placeholder={t("invite_field_shop_url_placeholder")}
        />
      </div>

      <div className="tcg-field">
        <label>{t("invite_message_label")}</label>
        <textarea
          className="tcg-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={effectiveMessage}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href={waLink || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="tcg-btn tcg-btn-primary"
          style={!digits ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          <Send size={16} /> {t("invite_generate")}
        </a>
        <button className="tcg-btn tcg-btn-secondary" type="button" onClick={handleCopy} disabled={!digits}>
          {copied ? <Check size={16} /> : null} {copied ? t("invite_copied") : t("invite_copy")}
        </button>
      </div>
    </div>
  );
}


function AdminDashboard({
  tab,
  setTab,
  products,
  categories,
  orders,
  ordersLoading,
  onSaveProduct,
  onDeleteProduct,
  onToggleVisible,
  onUpdateOrderStatus,
  onRefreshOrders,
  adminSecret,
}) {
  const { t } = useT();
  return (
    <div className="tcg-container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      <div className="tcg-tabs">
        <button className={`tcg-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          <Boxes size={16} /> {t("admin_tab_products")}
        </button>
        <button className={`tcg-tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          <ClipboardList size={16} /> {t("admin_tab_orders")}
        </button>
        <button className={`tcg-tab ${tab === "invite" ? "active" : ""}`} onClick={() => setTab("invite")}>
          <Send size={16} /> {t("admin_tab_invite")}
        </button>
      </div>
      {tab === "products" && (
        <AdminProductsTab
          products={products}
          categories={categories}
          onSave={onSaveProduct}
          onDelete={onDeleteProduct}
          onToggleVisible={onToggleVisible}
          adminSecret={adminSecret}
        />
      )}
      {tab === "orders" && (
        <AdminOrdersTab orders={orders} loading={ordersLoading} onUpdateStatus={onUpdateOrderStatus} onRefresh={onRefreshOrders} />
      )}
      {tab === "invite" && <AdminInviteTab />}
    </div>
  );
}

/* ============================================================================
   ROOT APP
   ========================================================================= */

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });
  const [lang, setLangState] = useState(() => loadSavedLang() || "nl");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [adminTab, setAdminTab] = useState("products");
  const [lastOrder, setLastOrder] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const isSubmittingRef = useRef(false);

  const t = useMemo(() => makeTranslator(lang), [lang]);

  function setLang(newLang) {
    setLangState(newLang);
    saveLang(newLang);
  }

  function goTo(name, params = {}) {
    setRoute({ name, params });
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  // ---- Producten laden. Als de opslag nog helemaal leeg is, zet de server
  //      (netlify/functions/products.mjs) zelf de voorbeeldproducten klaar. ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setProductsLoading(true);
      const data = await apiGetProducts();
      if (cancelled) return;
      setProducts(data || []);
      setProductsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const fromProducts = products.map((p) => p.category).filter(Boolean);
    return [...new Set([...DEFAULT_CATEGORIES, ...fromProducts])];
  }, [products]);

  // ---- Winkelmand ----
  function addToCart(product, qty = 1) {
    const resolvedName = resolveProductField(product, lang, "name");
    setCart((prev) => {
      const existing = prev.find((it) => it.productId === product.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id ? { ...it, quantity: Math.min(99, it.quantity + qty) } : it
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: resolvedName,
          price: product.price,
          status: product.status,
          imageUrl: product.imageUrl,
          quantity: Math.min(99, qty),
        },
      ];
    });
  }

  function updateCartQty(productId, qty) {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((it) => (it.productId === productId ? { ...it, quantity: Math.min(99, qty) } : it)));
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((it) => it.productId !== productId));
  }

  const cartTotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // ---- Bestelling plaatsen ----
  async function handleSubmitOrder(formData) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmittingOrder(true);
    setSubmitError(null);
    try {
      const phoneFull = buildFullPhone(formData.phoneCountry, formData.phoneNumber);
      const countryName = COUNTRIES.find((c) => c.code === formData.country)?.name || formData.country;
      const draft = {
        language: lang,
        items: cart.map((it) => ({ ...it })),
        total: cartTotal,
        customer: {
          name: formData.name.trim(),
          address: formData.address.trim(),
          postalCode: formData.postalCode.trim(),
          city: formData.city.trim(),
          country: countryName,
          phoneFull,
          email: formData.email.trim(),
          note: formData.note.trim(),
        },
        orderStatus: "new",
        emailStatus: "pending",
        consentAccepted: true,
      };

      // 1) Eerst opslaan — dit is de bron van waarheid. Pas bij succes tonen we
      //    de bevestiging (zie spec-eis: nooit "succesvol" tonen als opslaan mislukt).
      //    De server genereert hier het bestelnummer en de aanmaakdatum.
      const order = await apiCreateOrder(draft);

      // 2) Daarna best-effort e-mail versturen. Mislukt dit, dan blijft de
      //    bestelling alsnog bewaard en zichtbaar in het beheerpaneel.
      const emailResult = await sendOrderEmail(order);
      order.emailStatus = emailResult.status;
      apiUpdateOrderEmailStatus(order.orderNumber, emailResult.status);

      setOrders((prev) => [order, ...prev]);
      setLastOrder(order);
      setCart([]);
      goTo("confirmation");
    } catch (err) {
      setSubmitError(t("checkout_error_generic", { email: SHOP_EMAIL }));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmittingOrder(false);
    }
  }

  // ---- Admin: inloggen / uitloggen ----
  // Verifieert de ingevoerde code bij de server (via een authenticated GET),
  // in plaats van een lokale string-vergelijking zoals in de artifact-versie.
  async function handleAdminLogin(enteredCode) {
    try {
      const list = await apiListOrders(enteredCode);
      setAdminSecret(enteredCode);
      setOrders(list);
      setIsAdminAuthenticated(true);
      goTo("admin");
      return { ok: true };
    } catch (err) {
      if (err.status === 401) {
        return { ok: false, message: t("admin_login_error") };
      }
      return { ok: false, message: "Er ging iets mis. Probeer het opnieuw." };
    }
  }

  function handleAdminLogout() {
    setIsAdminAuthenticated(false);
    setAdminSecret("");
    goTo("home");
  }

  async function refreshOrders() {
    setOrdersLoading(true);
    try {
      const list = await apiListOrders(adminSecret);
      setOrders(list);
    } catch {
      setGlobalError("Bestellingen ophalen is mislukt. Probeer het opnieuw.");
    }
    setOrdersLoading(false);
  }

  // ---- Admin: producten beheren ----
  async function handleSaveProduct(data) {
    let updated;
    if (data.id) {
      updated = products.map((p) => (p.id === data.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
    } else {
      const newProduct = {
        ...data,
        id: newId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = [newProduct, ...products];
    }
    setProducts(updated);
    const ok = await apiSaveProducts(updated, adminSecret);
    if (!ok) setGlobalError("Opslaan van het product is mislukt. Probeer het opnieuw.");
  }

  async function handleDeleteProduct(product) {
    const name = resolveProductField(product, lang, "name");
    if (typeof window !== "undefined" && !window.confirm(t("admin_delete_confirm", { name }))) {
      return;
    }
    const updated = products.filter((p) => p.id !== product.id);
    setProducts(updated);
    const ok = await apiSaveProducts(updated, adminSecret);
    if (!ok) setGlobalError("Verwijderen van het product is mislukt. Probeer het opnieuw.");
  }

  async function handleToggleVisible(productId) {
    const updated = products.map((p) => (p.id === productId ? { ...p, visible: !p.visible } : p));
    setProducts(updated);
    const ok = await apiSaveProducts(updated, adminSecret);
    if (!ok) setGlobalError("Bijwerken van zichtbaarheid is mislukt. Probeer het opnieuw.");
  }

  async function handleUpdateOrderStatus(orderNumber, newStatus) {
    const target = orders.find((o) => o.orderNumber === orderNumber);
    if (!target) return;
    const updatedOrder = { ...target, orderStatus: newStatus };
    setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? updatedOrder : o)));
    const ok = await apiUpdateOrderStatus(orderNumber, newStatus, adminSecret);
    if (!ok) {
      setGlobalError("Status bijwerken is mislukt. Probeer het opnieuw.");
      setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? target : o)));
    }
  }

  // ---- Render ----
  const isAdminRoute = route.name === "admin" || route.name === "admin-login";
  const activeProduct = route.name === "product" ? products.find((p) => p.id === route.params.id) : null;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <div className="tcg-app">
        <style>{APP_CSS}</style>

        {!isAdminRoute && <Header route={route} goTo={goTo} cartCount={cartCount} />}

        {globalError && (
          <div className="tcg-container" style={{ paddingTop: 16 }}>
            <div className="tcg-notice error">
              <AlertTriangle size={18} />
              <div style={{ flex: 1 }}>{globalError}</div>
              <button className="tcg-btn-icon" onClick={() => setGlobalError(null)} aria-label="Close">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <main>
          {route.name === "home" &&
            (productsLoading ? (
              <Spinner label={t("loading_generic")} />
            ) : (
              <HomeView products={products} goTo={goTo} addToCart={addToCart} />
            ))}

          {route.name === "catalog" &&
            (productsLoading ? (
              <Spinner label={t("loading_generic")} />
            ) : (
              <CatalogView products={products} goTo={goTo} initialCategory={route.params.category} addToCart={addToCart} />
            ))}

          {route.name === "product" && <ProductView product={activeProduct} goTo={goTo} addToCart={addToCart} />}

          {route.name === "cart" && (
            <CartView cart={cart} updateQty={updateCartQty} removeFromCart={removeFromCart} goTo={goTo} cartTotal={cartTotal} />
          )}

          {route.name === "checkout" && (
            <CheckoutView
              cart={cart}
              cartTotal={cartTotal}
              goTo={goTo}
              onSubmitOrder={handleSubmitOrder}
              submitting={isSubmittingOrder}
              submitError={submitError}
            />
          )}

          {route.name === "confirmation" && <ConfirmationView order={lastOrder} goTo={goTo} />}

          {route.name === "privacy" && <PrivacyView />}
          {route.name === "terms" && <TermsView />}
          {route.name === "cookies" && <CookiesView />}

          {route.name === "admin-login" && <AdminLoginView onLogin={handleAdminLogin} goTo={goTo} />}

          {route.name === "admin" && (
            <div className="tcg-admin-shell">
              <AdminHeader goTo={goTo} onLogout={handleAdminLogout} />
              {!isAdminAuthenticated ? (
                <AdminLoginView onLogin={handleAdminLogin} goTo={goTo} />
              ) : (
                <AdminDashboard
                  tab={adminTab}
                  setTab={setAdminTab}
                  products={products}
                  categories={categories}
                  orders={orders}
                  ordersLoading={ordersLoading}
                  adminSecret={adminSecret}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onToggleVisible={handleToggleVisible}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onRefreshOrders={refreshOrders}
                />
              )}
            </div>
          )}
        </main>

        {!isAdminRoute && <Footer goTo={goTo} isAdminAuthenticated={isAdminAuthenticated} />}
      </div>
    </LangContext.Provider>
  );
}
