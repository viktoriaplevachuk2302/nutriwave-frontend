import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, onSnapshot, arrayUnion, increment } from "firebase/firestore";

const Recipes = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = {
    all: "Всі",
    breakfast: "Сніданок",
    lunch: "Обід",
    dinner: "Вечеря",
    snack: "Перекус",
  };
  const recipes = [
    // ==================== СНІДАНОК (15 рецептів) ====================
    {
      id: 1,
      title: "Чіа-пудинг з гарбузом",
      category: "breakfast",
      calories: 289,
      protein: 8,
      carbs: 35,
      fat: 12,
      image: "https://i.pinimg.com/1200x/40/52/49/405249c680f3bb0fea28f7f34e75ea26.jpg",
      shortDescription: "Осінній пудинг з гарбузовим смаком і корицею",
      ingredients: ["2 ст. л. насіння чіа", "1/2 склянки мигдального молока", "1/4 склянки гарбузового пюре", "1 ч. л. меду", "кориця"],
      instructions: "Змішайте всі інгредієнти в банку, залиште в холодильнику на ніч. Ранком додайте ягоди або горіхи."
    },
    {
      id: 2,
      title: "Вівсянка з ягодами",
      category: "breakfast",
      calories: 346,
      protein: 12,
      carbs: 55,
      fat: 8,
      image: "https://i.pinimg.com/1200x/a4/2f/d6/a42fd6e09c40ea02e9aa4c4c935e5d58.jpg",
      shortDescription: "Класична вівсянка з свіжими ягодами та медом",
      ingredients: ["50г вівсяних пластівців", "200мл молока", "100г ягід", "1 ч. л. меду", "горіхи за смаком"],
      instructions: "Зваріть вівсянку на молоці, додайте ягоди та мед перед подачею."
    },
    {
      id: 3,
      title: "Авокадо тост з яйцем",
      category: "breakfast",
      calories: 210,
      protein: 10,
      carbs: 20,
      fat: 15,
      image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      shortDescription: "Корисний тост з авокадо та яйцем пашот",
      ingredients: ["1 скибка цільнозернового хліба", "1/2 авокадо", "1 яйце", "сіль, перець"],
      instructions: "Підсмажте хліб, розімніть авокадо, додайте яйце пашот."
    },
    {
      id: 4,
      title: "Грецький йогурт з гранолою",
      category: "breakfast",
      calories: 320,
      protein: 20,
      carbs: 40,
      fat: 10,
      image: "https://i.pinimg.com/1200x/45/41/f1/4541f1a2fc849fe0d8eba1c981e4f070.jpg",
      shortDescription: "Йогурт з домашньою гранолою та фруктами",
      ingredients: ["200г грецького йогурту", "30г граноли", "фрукти", "мед"],
      instructions: "Змішайте йогурт з гранолою, додайте фрукти."
    },
    {
      id: 5,
      title: "Зелений смузі",
      category: "breakfast",
      calories: 250,
      protein: 15,
      carbs: 35,
      fat: 5,
      image: "https://i.pinimg.com/1200x/78/d5/90/78d590776aa52652511f9d19989a5fe1.jpg",
      shortDescription: "Смузі зі шпинатом та протеїном",
      ingredients: ["шпинат", "банан", "протеїн", "молоко"],
      instructions: "Зблендеруйте."
    },
    {
      id: 6,
      title: "Яєчня з овочами",
      category: "breakfast",
      calories: 250,
      protein: 18,
      carbs: 10,
      fat: 15,
      image: "https://i.pinimg.com/736x/e7/8b/05/e78b05e9bf8ef1403c425db93ada9400.jpg",
      shortDescription: "Яєчня з помідорами та перцем",
      ingredients: ["3 яйця", "помідор", "перець", "цибуля"],
      instructions: "Обсмажте овочі, додайте яйця."
    },
    {
      id: 7,
      title: "Панкейки з вівсянки",
      category: "breakfast",
      calories: 350,
      protein: 15,
      carbs: 50,
      fat: 10,
      image: "https://images.unsplash.com/photo-1590137865482-78d25881f498?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      shortDescription: "Здорові панкейки без борошна",
      ingredients: ["вівсянка", "банан", "яйця", "молоко"],
      instructions: "Зблендеруйте і смажте на сковороді."
    },
    {
      id: 8,
      title: "Сир з фруктами",
      category: "breakfast",
      calories: 220,
      protein: 25,
      carbs: 20,
      fat: 5,
      image: "https://i.pinimg.com/1200x/3e/a3/ac/3ea3ac18779e53dcd9d3e3caed5f552b.jpg",
      shortDescription: "Сир з ягодами та медом",
      ingredients: ["200г сиру", "ягоди", "мед"],
      instructions: "Змішайте і їжте."
    },
    {
      id: 9,
      title: "Тост з лососем",
      category: "breakfast",
      calories: 300,
      protein: 20,
      carbs: 25,
      fat: 15,
      image: "https://i.pinimg.com/1200x/6a/7e/45/6a7e454b4e02a34d9eadc365b94c155b.jpg",
      shortDescription: "Тост з копченим лососем та авокадо",
      ingredients: ["хліб", "лосось", "авокадо"],
      instructions: "Зберіть тост."
    },
    {
      id: 10,
      title: "Омлет з грибами",
      category: "breakfast",
      calories: 280,
      protein: 22,
      carbs: 8,
      fat: 18,
      image: "https://i.pinimg.com/1200x/6c/ae/64/6cae64378a00e10b2f9cfbc8da45d7b8.jpg",
      shortDescription: "Омлет з грибами та сиром",
      ingredients: ["яйця", "гриби", "сир"],
      instructions: "Обсмажте гриби, додайте яйця."
    },
    {
      id: 11,
      title: "Смузі боул",
      category: "breakfast",
      calories: 380,
      protein: 10,
      carbs: 60,
      fat: 12,
      image: "https://i.pinimg.com/736x/97/1e/33/971e33da86f54ccd6e5713845512cbe4.jpg",
      shortDescription: "Боул з фруктами та гранолою",
      ingredients: ["фрукти", "гранола"],
      instructions: "Зблендеруйте і додайте топінги."
    },
    {
      id: 12,
      title: "Кіноа з яйцем",
      category: "breakfast",
      calories: 340,
      protein: 18,
      carbs: 45,
      fat: 10,
      image: "https://i.pinimg.com/1200x/f1/cb/d5/f1cbd55469070ed0024a5fcf942974c4.jpg",
      shortDescription: "Кіноа з яйцем пашот",
      ingredients: ["кіноа", "яйце", "овочі"],
      instructions: "Зваріть кіноа, додайте яйце."
    },
    {
      id: 13,
      title: "Йогуртовий парфе",
      category: "breakfast",
      calories: 300,
      protein: 20,
      carbs: 40,
      fat: 8,
      image: "https://i.pinimg.com/736x/31/a0/62/31a06279a9652216e498abe81888d8e9.jpg",
      shortDescription: "Шари йогурту з гранолою та фруктами",
      ingredients: ["йогурт", "гранола", "фрукти"],
      instructions: "Шаруйте в склянці."
    },
    {
      id: 14,
      title: "Бананові млинці",
      category: "breakfast",
      calories: 320,
      protein: 12,
      carbs: 50,
      fat: 10,
      image: "https://i.pinimg.com/736x/a7/8d/46/a78d469e7846dfb6b295af38545634cc.jpg",
      shortDescription: "Млинці з банана та яєць",
      ingredients: ["банан", "яйця", "вівсянка"],
      instructions: "Зблендеруйте і смажте."
    },
    {
      id: 15,
      title: "Зелений смузі",
      category: "breakfast",
      calories: 250,
      protein: 15,
      carbs: 35,
      fat: 5,
      image: "https://i.pinimg.com/736x/c5/dc/c1/c5dcc19628a9c36df69978646704bd4c.jpg",
      shortDescription: "Смузі зі шпинатом та протеїном",
      ingredients: ["шпинат", "банан", "протеїн", "молоко"],
      instructions: "Зблендеруйте."
    },

    // ==================== ОБІД (15 рецептів) ====================
    {
      id: 16,
      title: "Грильована курка з кіноа та овочами",
      category: "lunch",
      calories: 480,
      protein: 38,
      carbs: 45,
      fat: 18,
      image: "https://i.pinimg.com/736x/87/b0/05/87b005a264b6d94c67bf67afc6e89863.jpg",
      shortDescription: "Ситний обід з куркою та кіноа",
      ingredients: ["150г курячої грудки", "100г кіноа", "200г овочів (броколі, перець)", "оливкова олія", "спеції"],
      instructions: "Запечіть курку з спеціями, зваріть кіноа, обсмажте овочі. Змішайте все в боулі."
    },
    {
      id: 17,
      title: "Салат Цезар з куркою",
      category: "lunch",
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 22,
      image: "https://i.pinimg.com/1200x/54/c8/f5/54c8f55219a891d2efd56c0f4d4bdc20.jpg",
      shortDescription: "Класичний Цезар з куркою гриль",
      ingredients: ["150г курячої грудки", "салат романо", "сухарики", "пармезан", "соус Цезар"],
      instructions: "Запечіть курку, наріжте салат, додайте сухарики та соус."
    },
    {
      id: 18,
      title: "Лосось з бататом та спаржею",
      category: "lunch",
      calories: 450,
      protein: 32,
      carbs: 35,
      fat: 25,
      image: "https://i.pinimg.com/736x/8f/00/62/8f006226a275f84c9f259483451ee534.jpg",
      shortDescription: "Запечений лосось з овочами",
      ingredients: ["150г лосося", "200г батату", "150г спаржі", "оливкова олія", "лимон"],
      instructions: "Запечіть лосось і овочі з олією та лимоном 20 хвилин."
    },
    {
      id: 19,
      title: "Суп з сочевицею та овочами",
      category: "lunch",
      calories: 380,
      protein: 20,
      carbs: 55,
      fat: 10,
      image: "https://i.pinimg.com/1200x/1b/55/7b/1b557bf14e5ebaa680a8d622be4eeb9f.jpg",
      shortDescription: "Ситний овочевий суп з сочевицею",
      ingredients: ["100г сочевиці", "морква, цибуля, селера", "часник", "спеції"],
      instructions: "Зваріть сочевицю з овочами до готовності."
    },
    {
      id: 20,
      title: "Боул з тунцем та авокадо",
      category: "lunch",
      calories: 460,
      protein: 30,
      carbs: 40,
      fat: 25,
      image: "https://i.pinimg.com/1200x/f1/8a/a3/f18aa3b451c50f1f9f083895685489e6.jpg",
      shortDescription: "Покі боул з тунцем та рисом",
      ingredients: ["1 банка тунця", "100г рису", "авокадо", "огірок", "соус"],
      instructions: "Зваріть рис, додайте тунець та овочі."
    },
    {
      id: 21,
      title: "Паста з куркою та песто",
      category: "lunch",
      calories: 520,
      protein: 32,
      carbs: 60,
      fat: 20,
      image: "https://i.pinimg.com/1200x/87/11/66/871166058e9cb63532298d7b98563de1.jpg",
      shortDescription: "Паста з куркою та базиліковим песто",
      ingredients: ["100г пасти", "150г курки", "2 ст. л. песто", "помідори чері"],
      instructions: "Зваріть пасту, обсмажте курку, змішайте з песто."
    },
    {
      id: 22,
      title: "Фарширований перець з фаршем",
      category: "lunch",
      calories: 430,
      protein: 28,
      carbs: 35,
      fat: 20,
      image: "https://i.pinimg.com/736x/fb/32/1f/fb321fade96642b62c80a35da09b12c3.jpg",
      shortDescription: "Перець фарширований індичкою та рисом",
      ingredients: ["2 перці", "150г індичого фаршу", "50г рису", "томатний соус"],
      instructions: "Запечіть фаршировані перці 40 хвилин."
    },
    {
      id: 23,
      title: "Салат з кіноа та фетою",
      category: "lunch",
      calories: 400,
      protein: 15,
      carbs: 45,
      fat: 20,
      image: "https://i.pinimg.com/1200x/27/fc/74/27fc74af25d17e4bc2eacabf4bfc90df.jpg",
      shortDescription: "Вегетаріанський салат з кіноа та сиром",
      ingredients: ["100г кіноа", "фета", "огірок", "помідори", "олія"],
      instructions: "Зваріть кіноа, змішайте з овочами та фетою."
    },
    {
      id: 24,
      title: "Риба на пару з овочами",
      category: "lunch",
      calories: 350,
      protein: 35,
      carbs: 20,
      fat: 15,
      image: "https://i.pinimg.com/736x/7d/a4/f1/7da4f1dd604b5071b8b3514a3f0b6763.jpg",
      shortDescription: "Тріска на пару з броколі",
      ingredients: ["150г тріски", "200г броколі", "лимон", "спеції"],
      instructions: "Приготуйте на пару 15 хвилин."
    },
    {
      id: 25,
      title: "Бургер з індички",
      category: "lunch",
      calories: 450,
      protein: 40,
      carbs: 35,
      fat: 18,
      image: "https://i.pinimg.com/736x/d6/10/26/d61026d701c11efd45c08c54e33d1730.jpg",
      shortDescription: "Здоровий бургер з індичкою та салатом",
      ingredients: ["котлета з індички", "булошка цільнозернова", "салат", "томат"],
      instructions: "Обсмажте котлету, зберіть бургер."
    },
    {
      id: 26,
      title: "Овочевий каррі з тофу",
      category: "lunch",
      calories: 380,
      protein: 20,
      carbs: 40,
      fat: 18,
      image: "https://i.pinimg.com/1200x/a7/51/89/a7518937bbcda276624996d5c15d365b.jpg",
      shortDescription: "Веганське каррі з тофу та овочами",
      ingredients: ["150г тофу", "овочі", "кокосове молоко", "каррі паста"],
      instructions: "Обсмажте тофу, додайте овочі та каррі."
    },
    {
      id: 27,
      title: "Рис з креветками",
      category: "lunch",
      calories: 470,
      protein: 30,
      carbs: 55,
      fat: 15,
      image: "https://i.pinimg.com/736x/f2/83/54/f28354a6cd4b656783b4cb68a7a38b0e.jpg",
      shortDescription: "Рис з креветками та овочами",
      ingredients: ["150г креветок", "100г рису", "овочі", "соєвий соус"],
      instructions: "Обсмажте креветки, змішайте з рисом."
    },
    {
      id: 28,
      title: "Суп з куркою та локшиною",
      category: "lunch",
      calories: 400,
      protein: 28,
      carbs: 45,
      fat: 12,
      image: "https://i.pinimg.com/736x/9e/bc/4d/9ebc4d0134e232f1abf90cd89d747cad.jpg",
      shortDescription: "Курячий суп з локшиною",
      ingredients: ["150г курки", "локшина", "морква", "цибуля"],
      instructions: "Зваріть бульйон, додайте локшину."
    },
    {
      id: 29,
      title: "Запіканка з броколі та сиром",
      category: "lunch",
      calories: 420,
      protein: 25,
      carbs: 30,
      fat: 22,
      image: "https://i.pinimg.com/736x/68/a0/78/68a07843a725a17339c253283a9b8618.jpg",
      shortDescription: "Запіканка з броколі та сиром",
      ingredients: ["300г броколі", "сир", "яйця", "вершки"],
      instructions: "Змішайте і запечіть 30 хвилин."
    },
    {
      id: 30,
      title: "Салат з тунцем та яйцем",
      category: "lunch",
      calories: 380,
      protein: 35,
      carbs: 15,
      fat: 20,
      image: "https://i.pinimg.com/1200x/2c/05/ce/2c05ce4bd03f86d60e6504fae6d62e91.jpg",
      shortDescription: "Нісуаз салат з тунцем",
      ingredients: ["тунець", "яйце", "салат", "оливки", "огірок"],
      instructions: "Змішайте всі інгредієнти."
    },

    // ==================== ВЕЧЕРЯ (15 рецептів) ====================
    {
      id: 31,
      title: "Запечений лосось з овочами",
      category: "dinner",
      calories: 450,
      protein: 35,
      carbs: 20,
      fat: 28,
      image: "https://i.pinimg.com/736x/42/25/16/422516fb681ed09639ebd74f69c21537.jpg",
      shortDescription: "Соковитий лосось з лимоном та спаржею",
      ingredients: ["150г лосося", "200г спаржі", "лимон", "оливкова олія", "часник", "трави"],
      instructions: "Запечіть лосось з овочами та лимоном 20 хвилин при 180°C."
    },
    {
      id: 32,
      title: "Курячий боул з кіноа",
      category: "dinner",
      calories: 523,
      protein: 40,
      carbs: 50,
      fat: 20,
      image: "https://i.pinimg.com/736x/93/1e/78/931e78b86bb58ac0f4047537d18e7035.jpg",
      shortDescription: "Ситний боул з куркою гриль та овочами",
      ingredients: ["150г курячої грудки", "100г кіноа", "авокадо", "огірок", "помідори", "соус"],
      instructions: "Запечіть курку, зваріть кіноа, зберіть боул з овочами."
    },
    {
      id: 33,
      title: "Стейк з індички з бататом",
      category: "dinner",
      calories: 480,
      protein: 42,
      carbs: 40,
      fat: 15,
      image: "https://i.pinimg.com/736x/61/86/f1/6186f13dfea3ca32866a5041daaeafa2.jpg",
      shortDescription: "Стейк з індички з запеченим бататом",
      ingredients: ["200г індички", "200г батату", "оливкова олія", "розмарин"],
      instructions: "Обсмажте стейк, запечіть батат з розмарином."
    },
    {
      id: 34,
      title: "Рататуй з тофу",
      category: "dinner",
      calories: 380,
      protein: 18,
      carbs: 35,
      fat: 20,
      image: "https://i.pinimg.com/1200x/a2/48/10/a24810cebeb17805d3a9cffb0a285c91.jpg",
      shortDescription: "Веганський рататуй з тофу",
      ingredients: ["150г тофу", "баклажан", "кабачок", "перець", "томати"],
      instructions: "Запечіть овочі з тофу в томатному соусі."
    },
    {
      id: 35,
      title: "Риба з овочами на грилі",
      category: "dinner",
      calories: 400,
      protein: 38,
      carbs: 25,
      fat: 18,
      image: "https://i.pinimg.com/1200x/88/da/05/88da05d7d2e44c811fa2f03c66f24ed4.jpg",
      shortDescription: "Тріска з овочами на грилі",
      ingredients: ["150г тріски", "кабачок", "перець", "лимон"],
      instructions: "Запечіть рибу та овочі з лимоном."
    },
    {
      id: 36,
      title: "Куряче філе з броколі",
      category: "dinner",
      calories: 420,
      protein: 45,
      carbs: 15,
      fat: 18,
      image: "https://i.pinimg.com/1200x/64/34/4e/64344e9bc7584d1415beb8d01ffe259f.jpg",
      shortDescription: "Курка з броколі та сиром",
      ingredients: ["150г курки", "200г броколі", "сир", "часник"],
      instructions: "Запечіть курку з броколі під сиром."
    },
    {
      id: 37,
      title: "Салат з тунцем та авокадо",
      category: "dinner",
      calories: 460,
      protein: 35,
      carbs: 20,
      fat: 28,
      image: "https://i.pinimg.com/736x/eb/e0/b0/ebe0b0f2020169dd533d22ede61064e4.jpg",
      shortDescription: "Легкий салат з тунцем та авокадо",
      ingredients: ["1 банка тунця", "авокадо", "салат", "огірок", "олія"],
      instructions: "Змішайте інгредієнти з олією."
    },
    {
      id: 38,
      title: "Овочева запіканка з куркою",
      category: "dinner",
      calories: 480,
      protein: 38,
      carbs: 30,
      fat: 22,
      image: "https://i.pinimg.com/736x/ea/4c/58/ea4c5853c6d8e3e97823c6d54a8cacae.jpg",
      shortDescription: "Запіканка з куркою та овочами",
      ingredients: ["150г курки", "кабачок", "баклажан", "сир"],
      instructions: "Запечіть все разом під сиром."
    },
    {
      id: 39,
      title: "Фарширований перець з фаршем",
      category: "dinner",
      calories: 430,
      protein: 30,
      carbs: 35,
      fat: 20,
      image: "https://i.pinimg.com/736x/ef/9b/e0/ef9be050f6080d9a4f069b97fc798868.jpg",
      shortDescription: "Перець з фаршем та рисом",
      ingredients: ["2 перці", "150г фаршу", "50г рису", "томатний соус"],
      instructions: "Нафаршируйте перці, запечіть 40 хвилин."
    },
    {
      id: 40,
      title: "Креветки з овочами",
      category: "dinner",
      calories: 380,
      protein: 35,
      carbs: 20,
      fat: 15,
      image: "https://i.pinimg.com/736x/2d/59/08/2d59085fd05013556c8321367f590fa5.jpg",
      shortDescription: "Креветки з овочами в соусі",
      ingredients: ["150г креветок", "перець", "цибуля", "соєвий соус"],
      instructions: "Обсмажте креветки з овочами."
    },
    {
      id: 41,
      title: "Курячий шашлик з овочами",
      category: "dinner",
      calories: 450,
      protein: 40,
      carbs: 25,
      fat: 20,
      image: "https://i.pinimg.com/736x/66/8a/50/668a50ca9defe52dd1dc2c09d637d30d.jpg",
      shortDescription: "Шашлик з курки та овочів",
      ingredients: ["150г курки", "перець", "цибуля", "маринад"],
      instructions: "Замаринуйте і запечіть на шпажках."
    },
    {
      id: 42,
      title: "Запечена тріска з лимоном",
      category: "dinner",
      calories: 350,
      protein: 40,
      carbs: 10,
      fat: 15,
      image: "https://i.pinimg.com/736x/76/a3/67/76a367c8dead998a0779f71782ba9f58.jpg",
      shortDescription: "Тріска з лимоном та травами",
      ingredients: ["150г тріски", "лимон", "трави", "олія"],
      instructions: "Запечіть в фользі з лимоном."
    },
    {
      id: 43,
      title: "Вегетаріанський чілі",
      category: "dinner",
      calories: 400,
      protein: 20,
      carbs: 50,
      fat: 15,
      image: "https://i.pinimg.com/736x/28/ca/b8/28cab8ea3f7d6d590c9ebb0157ac42f5.jpg",
      shortDescription: "Чілі з бобами та овочами",
      ingredients: ["боби", "томати", "перець", "спеції"],
      instructions: "Тушкуйте все разом 30 хвилин."
    },
    {
      id: 44,
      title: "Курка з грибами",
      category: "dinner",
      calories: 460,
      protein: 42,
      carbs: 20,
      fat: 22,
      image: "https://i.pinimg.com/1200x/00/4c/1c/004c1c1e276f0c5f0755ec5000de1718.jpg",
      shortDescription: "Курка з грибами в вершковому соусі",
      ingredients: ["150г курки", "гриби", "вершки", "часник"],
      instructions: "Обсмажте курку з грибами, додайте вершки."
    },
    {
      id: 45,
      title: "Салат з куркою та авокадо",
      category: "dinner",
      calories: 480,
      protein: 35,
      carbs: 25,
      fat: 28,
      image: "https://i.pinimg.com/1200x/aa/8a/27/aa8a2702e8d56aa799f13693a612237c.jpg",
      shortDescription: "Ситний салат з куркою гриль та авокадо",
      ingredients: ["150г курки", "авокадо", "салат", "помідори"],
      instructions: "Запечіть курку, змішайте з овочами."
    },

    // ==================== ПЕРЕКУС (15 рецептів) ====================
    {
      id: 46,
      title: "Горіховий мікс з сухофруктами",
      category: "snack",
      calories: 180,
      protein: 5,
      carbs: 15,
      fat: 14,
      image: "https://i.pinimg.com/1200x/d8/de/6d/d8de6d84bbf5e269bc1740f7e06c2e11.jpg",
      shortDescription: "Мікс мигдалю, волоських горіхів та родзинок",
      ingredients: ["20г мигдалю", "20г волоських горіхів", "20г родзинок", "щіпка солі"],
      instructions: "Змішайте горіхи з сухофруктами. Зберігайте в контейнері для швидкого перекусу."
    },
    {
      id: 47,
      title: "Яблуко з арахісовою пастою",
      category: "snack",
      calories: 220,
      protein: 6,
      carbs: 28,
      fat: 12,
      image: "https://i.pinimg.com/1200x/d7/80/2f/d7802f6dc66f056ce7e4d419837d2756.jpg",
      shortDescription: "Яблуко з натуральною арахісовою пастою",
      ingredients: ["1 яблуко", "2 ст. л. арахісової пасти", "щіпка кориці"],
      instructions: "Наріжте яблуко скибочками, намастіть пасту, посипте корицею."
    },
    {
      id: 48,
      title: "Грецький йогурт з ягодами",
      category: "snack",
      calories: 150,
      protein: 15,
      carbs: 15,
      fat: 4,
      image: "https://i.pinimg.com/736x/f1/73/78/f1737878ba2cd6951fbf310d8dcc18c4.jpg",
      shortDescription: "Йогурт з свіжими ягодами та медом",
      ingredients: ["150г грецького йогурту", "100г ягід", "1 ч. л. меду"],
      instructions: "Змішайте йогурт з ягодами та медом."
    },
    {
      id: 49,
      title: "Хумус з морквяними паличками",
      category: "snack",
      calories: 200,
      protein: 8,
      carbs: 25,
      fat: 10,
      image: "https://i.pinimg.com/736x/84/29/09/84290900382b7136959e10ba4f90f833.jpg",
      shortDescription: "Домашній хумус з овочами",
      ingredients: ["100г хумусу", "2 моркви", "огірок"],
      instructions: "Наріжте овочі паличками, подавайте з хумусом."
    },
    {
      id: 50,
      title: "Протеїновий батончик домашній",
      category: "snack",
      calories: 220,
      protein: 15,
      carbs: 20,
      fat: 10,
      image: "https://i.pinimg.com/736x/a4/a5/40/a4a5404b91283d4e26b3088dba9e85bd.jpg",
      shortDescription: "Батончик з вівсянки та протеїну",
      ingredients: ["вівсянка", "протеїн", "мед", "горіхи"],
      instructions: "Змішайте, сформуйте батончики, охолодіть."
    },
    {
      id: 51,
      title: "Сирні палички з овочами",
      category: "snack",
      calories: 180,
      protein: 18,
      carbs: 10,
      fat: 10,
      image: "https://i.pinimg.com/1200x/a3/28/5f/a3285f158e586e1164d60ae5552f8484.jpg",
      shortDescription: "Сир моцарела з помідорами",
      ingredients: ["100г моцарели", "помідори чері", "базилік"],
      instructions: "Нанизайте на шпажки або подавайте окремо."
    },
    {
      id: 52,
      title: "Зелений смузі",
      category: "snack",
      calories: 160,
      protein: 10,
      carbs: 25,
      fat: 4,
      image: "https://i.pinimg.com/736x/0d/54/f2/0d54f2a2b450517ff59512b4713e3112.jpg",
      shortDescription: "Смузі зі шпинатом та бананом",
      ingredients: ["шпинат", "банан", "йогурт", "вода"],
      instructions: "Зблендеруйте і візьміть з собою."
    },
    {
      id: 53,
      title: "Рисові хлібці з авокадо",
      category: "snack",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 12,
      image: "https://i.pinimg.com/1200x/aa/0a/e4/aa0ae45557f316b084643bc341d3539d.jpg",
      shortDescription: "Хлібці з авокадо та помідором",
      ingredients: ["2 рисові хлібці", "1/2 авокадо", "помідор"],
      instructions: "Розімніть авокадо, додайте помідор."
    },
    {
      id: 54,
      title: "Кефір з насінням чіа",
      category: "snack",
      calories: 170,
      protein: 12,
      carbs: 15,
      fat: 8,
      image: "https://i.pinimg.com/736x/e1/34/ea/e134eaa1adbca8fadf12bfb799d1346c.jpg",
      shortDescription: "Кефір з чіа та ягодами",
      ingredients: ["200мл кефіру", "1 ст. л. чіа", "ягоди"],
      instructions: "Змішайте чіа з кефіром, залиште на 10 хвилин."
    },
    {
      id: 55,
      title: "Оливки з сиром",
      category: "snack",
      calories: 190,
      protein: 10,
      carbs: 5,
      fat: 15,
      image: "https://i.pinimg.com/736x/55/79/0f/55790f33cfe933ca8ca36f1df3860b17.jpg",
      shortDescription: "Оливки з фетою",
      ingredients: ["50г оливок", "50г фети", "трави"],
      instructions: "Подавайте разом."
    },
    {
      id: 56,
      title: "Банан з мигдалевою пастою",
      category: "snack",
      calories: 210,
      protein: 6,
      carbs: 30,
      fat: 10,
      image: "https://i.pinimg.com/1200x/ab/8d/82/ab8d82540d1ac6900f8e73418062700d.jpg",
      shortDescription: "Банан з мигдалевою пастою",
      ingredients: ["1 банан", "2 ст. л. мигдалевої пасти"],
      instructions: "Наріжте банан, намастіть пасту."
    },
    {
      id: 57,
      title: "Енергетичні кульки",
      category: "snack",
      calories: 200,
      protein: 8,
      carbs: 25,
      fat: 10,
      image: "https://i.pinimg.com/1200x/e9/d2/fe/e9d2fe783ae674f33de45abe3678c71a.jpg",
      shortDescription: "Кульки з фініків та горіхів",
      ingredients: ["фініки", "горіхи", "кокосова стружка"],
      instructions: "Зблендеруйте, сформуйте кульки."
    },
    {
      id: 58,
      title: "Огіркові скибочки з хумусом",
      category: "snack",
      calories: 150,
      protein: 6,
      carbs: 20,
      fat: 8,
      image: "https://i.pinimg.com/736x/84/29/09/84290900382b7136959e10ba4f90f833.jpg",
      shortDescription: "Огірок з хумусом",
      ingredients: ["1 огірок", "100г хумусу"],
      instructions: "Наріжте огірок, подавайте з хумусом."
    },
  ];

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter((r) => r.category === selectedCategory));
    }
    setLoading(false);
  }, [selectedCategory]);

  const handleAddToDiary = async (mealType) => {
    if (!selectedRecipe || !auth.currentUser) return;

    const date = new Date().toISOString().split("T")[0];

    const data = {
      mealType, // ← це ключовий рядок — тепер слоти знають, куди додати!
      foodName: selectedRecipe.title,
      calories: selectedRecipe.calories || 0,
      protein: selectedRecipe.protein || 0,
      carbs: selectedRecipe.carbs || 0,
      fat: selectedRecipe.fat || 0,
      addedAt: new Date().toISOString(),
    };

    try {
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", date);

      // Перевіряємо, чи існує документ
      const docSnap = await getDoc(diaryRef);
      if (!docSnap.exists()) {
        await setDoc(diaryRef, {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          waterGlasses: 0,
          waterLiters: 0,
          meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        });
      }

      await setDoc(diaryRef, {
        [`meals.${mealType}`]: arrayUnion(data),
        totalCalories: increment(data.calories),
        totalProtein: increment(data.protein),
        totalCarbs: increment(data.carbs),
        totalFat: increment(data.fat),
      }, { merge: true });

      alert(`${selectedRecipe.title} додано до ${categories[mealType]}!`);
      setShowAddModal(false);
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Помилка додавання:", err);
      alert("Помилка додавання рецепту в щоденник");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem" }}>Завантаження рецептів...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Рецепти
      </h1>

      {/* Фільтр */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        {Object.keys(categories).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              background: selectedCategory === key ? "#5B7133" : "#C8D094",
              color: selectedCategory === key ? "white" : "#5B7133",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {categories[key]}
          </button>
        ))}
      </div>

      {/* Сітка рецептів */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{ cursor: "pointer", transition: "transform 0.3s" }}
            onClick={() => setSelectedRecipe(recipe)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "16px 16px 0 0" }}
            />
            <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "0 0 16px 16px" }}>
              <h3 style={{ color: "#5B7133", marginBottom: "0.5rem" }}>{recipe.title}</h3>
              <p style={{ color: "#666", marginBottom: "1rem" }}>{recipe.shortDescription}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B7133" }}>{recipe.calories} ккал</p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Б: {recipe.protein}г · В: {recipe.carbs}г · Ж: {recipe.fat}г
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Детальний перегляд */}
      {selectedRecipe && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setSelectedRecipe(null)}>
          <div className="card" style={{ width: "700px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            <div style={{ padding: "2rem" }}>
              <h2 style={{ color: "#5B7133", textAlign: "center" }}>{selectedRecipe.title}</h2>
              <p style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "bold" }}>{selectedRecipe.calories} ккал</p>
              <p style={{ textAlign: "center", color: "#666" }}>
                Б: {selectedRecipe.protein}г · В: {selectedRecipe.carbs}г · Ж: {selectedRecipe.fat}г
              </p>
              <h3 style={{ color: "#5B7133" }}>Інгредієнти:</h3>
              <ul>{selectedRecipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              <h3 style={{ color: "#5B7133" }}>Приготування:</h3>
              <p>{selectedRecipe.instructions}</p>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ width: "100%" }}>
                Додати до раціону
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка вибору прийому їжі */}
      {showAddModal && selectedRecipe && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
        }}>
          <div className="card" style={{ width: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#5B7133", marginBottom: "1.5rem" }}>
              Додати "{selectedRecipe.title}" до:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                <button
                  key={meal}
                  onClick={() => handleAddToDiary(meal)}
                  className="btn btn-primary"
                >
                  {categories[meal]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ marginTop: "1.5rem", background: "none", color: "#5B7133", border: "none", cursor: "pointer" }}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;