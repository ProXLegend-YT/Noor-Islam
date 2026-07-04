// Noor Islam — misc content datasets

const DUAS = [
{id:1,cat:"Morning",title:"Upon Waking",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
translit:"Alhamdu lillahi alladhi ahyana ba'da ma amatana wa ilayhin-nushur",
mean:"Praise be to Allah who gave us life after having taken it from us, and to Him is the return."},
{id:2,cat:"Morning",title:"Morning Remembrance",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
translit:"Asbahna wa asbahal-mulku lillah, walhamdu lillah",
mean:"We have entered the morning and the dominion belongs to Allah, and all praise is for Allah."},
{id:3,cat:"Evening",title:"Evening Remembrance",ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
translit:"Amsayna wa amsal-mulku lillah, walhamdu lillah",
mean:"We have entered the evening and the dominion belongs to Allah, and all praise is for Allah."},
{id:4,cat:"Evening",title:"Before Sleeping",ar:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
translit:"Bismika Allahumma amutu wa ahya",
mean:"In Your name, O Allah, I die and I live."},
{id:5,cat:"Daily",title:"Before Eating",ar:"بِسْمِ اللَّهِ",translit:"Bismillah",mean:"In the name of Allah."},
{id:6,cat:"Daily",title:"After Eating",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
translit:"Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wala quwwah",
mean:"Praise be to Allah who fed me this and provided it for me without any might or power from myself."},
{id:7,cat:"Daily",title:"Entering the Home",ar:"بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا",
translit:"Bismillahi walajna wa bismillahi kharajna wa ala Rabbina tawakkalna",
mean:"In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust."},
{id:8,cat:"Daily",title:"For Anxiety and Grief",ar:"اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ",
translit:"Allahumma inni abduka ibnu abdika ibnu amatika, nasiyati biyadik",
mean:"O Allah, I am Your servant, son of Your servant, son of Your maidservant; my forelock is in Your hand."},
{id:9,cat:"Travel",title:"Dua for Travel",ar:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
translit:"Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
mean:"Glory be to the One who has subjected this to us, for we were not able to do it by ourselves."},
{id:10,cat:"Protection",title:"Seeking Refuge",ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
translit:"A'udhu bikalimatillahit-tammati min sharri ma khalaq",
mean:"I seek refuge in the perfect words of Allah from the evil of what He has created."}
];

const QUOTES = [
{ar:"وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",text:"And whoever fears Allah, He will make a way out for him.",ref:"Surah At-Talaq 65:2"},
{ar:"إِنَّ مَعَ الْعُسْرِ يُسْرًا",text:"Indeed, with hardship comes ease.",ref:"Surah Ash-Sharh 94:6"},
{ar:"وَبَشِّرِ الصَّابِرِينَ",text:"And give good tidings to the patient.",ref:"Surah Al-Baqarah 2:155"},
{ar:"فَاذْكُرُونِي أَذْكُرْكُمْ",text:"So remember Me; I will remember you.",ref:"Surah Al-Baqarah 2:152"},
{ar:"وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",text:"And He is with you wherever you are.",ref:"Surah Al-Hadid 57:4"}
];

const VERSE_OF_DAY = [
{ar:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
en:"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.",
ur:"اللہ، اُس کے سوا کوئی معبود نہیں، وہ زندہ اور ہمیشہ قائم رہنے والا ہے۔",
ref:"Ayat al-Kursi, Al-Baqarah 2:255"},
{ar:"وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
en:"And I did not create the jinn and mankind except to worship Me.",
ur:"اور میں نے جنوں اور انسانوں کو صرف اپنی عبادت کے لیے پیدا کیا ہے۔",
ref:"Surah Adh-Dhariyat 51:56"},
{ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
en:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
ur:"اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
ref:"Surah Al-Baqarah 2:201"}
];

const LIBRARY_BOOKS = [
{id:1,title:"Riyad as-Salihin",author:"Imam an-Nawawi",cat:"Hadith",desc:"A beloved compilation of authentic hadith organised by topics of faith, worship and character."},
{id:2,title:"Tafsir Ibn Kathir (Abridged)",author:"Ibn Kathir",cat:"Quran Studies",desc:"One of the most widely referenced classical commentaries on the Qur'an, explaining verses with hadith and scholarly narration."},
{id:3,title:"Ar-Raheeq Al-Makhtum (The Sealed Nectar)",author:"Safi-ur-Rahman al-Mubarakpuri",cat:"Seerah",desc:"An award-winning biography of Prophet Muhammad ﷺ tracing his life from birth to the completion of his mission."},
{id:4,title:"The Fundamentals of Tawheed",author:"Dr. Abu Ameenah Bilal Philips",cat:"Islamic Knowledge",desc:"A clear introduction to Islamic monotheism and the categories of Tawheed."},
{id:5,title:"Stories of the Prophets",author:"Ibn Kathir",cat:"Islamic History",desc:"Narrations of the lives and lessons of the Prophets mentioned in the Qur'an, from Adam to Muhammad ﷺ."},
{id:6,title:"Fiqh-us-Sunnah",author:"Sayyid Sabiq",cat:"Islamic Knowledge",desc:"A comprehensive reference on Islamic jurisprudence rooted directly in the Qur'an and Sunnah."},
{id:7,title:"The Sealed Garden: 40 Hadith Nawawi",author:"Imam an-Nawawi",cat:"Hadith",desc:"Forty-two foundational hadith covering the core principles of the Islamic faith."},
{id:8,title:"Lives of the Sahabah",author:"Muhammad Yusuf Kandhlawi",cat:"Seerah",desc:"Inspiring accounts of the Companions of the Prophet ﷺ and their sacrifices for Islam."},
{id:9,title:"The History of Islam",author:"Akbar Shah Najeebabadi",cat:"Islamic History",desc:"A detailed survey of Islamic civilisation from the Prophet's era through the Caliphates."},
{id:10,title:"Purification of the Heart",author:"Hamza Yusuf",cat:"Islamic Knowledge",desc:"A study of the spiritual diseases of the heart drawn from a classical Islamic text, with practical remedies."},
{id:11,title:"Tafsir al-Jalalayn",author:"Al-Mahalli & As-Suyuti",cat:"Quran Studies",desc:"A concise classical commentary explaining the meaning of the Qur'an verse by verse."},
{id:12,title:"The Life of the Prophet Muhammad ﷺ",author:"Ibn Hisham",cat:"Seerah",desc:"One of the earliest and most authoritative biographical works on the Prophet's life."}
];

const NEWS = [
{id:1,title:"Global Muslim population continues steady growth, researchers report",tag:"World",summary:"Demographic studies continue to track the growth of Muslim communities across Asia, Africa, Europe and the Americas, with mosques and Islamic centres expanding to serve new generations."},
{id:2,title:"Mosques worldwide expand community iftar and outreach programmes",tag:"Community",summary:"Local mosques increasingly run food banks, youth programmes and interfaith outreach alongside their regular prayer and education services."},
{id:3,title:"Digital Qur'an memorisation apps see rising adoption among youth",tag:"Technology",summary:"More young Muslims are turning to mobile apps and online circles to memorise and revise the Qur'an, complementing traditional hifz programmes."},
{id:4,title:"Islamic finance sector sees continued interest from new markets",tag:"Finance",summary:"Sukuk issuance and Sharia-compliant banking products continue to attract interest from both Muslim-majority and Muslim-minority countries."},
{id:5,title:"Universities expand Islamic studies and Arabic language offerings",tag:"Education",summary:"A growing number of universities are introducing or expanding programmes in Islamic studies, classical Arabic and comparative religion."}
];

const QUIZ_QUESTIONS = {
easy:[
{q:"How many pillars of Islam are there?",options:["3","4","5","6"],a:2},
{q:"What is the first Surah of the Qur'an?",options:["Al-Baqarah","Al-Fatihah","An-Nas","Al-Ikhlas"],a:1},
{q:"How many times a day do Muslims pray obligatory prayers?",options:["3","4","5","7"],a:2},
{q:"In which month do Muslims fast?",options:["Shawwal","Ramadan","Muharram","Rajab"],a:1},
{q:"What is the Islamic declaration of faith called?",options:["Shahadah","Zakat","Salah","Sawm"],a:0},
{q:"Which city do Muslims face during prayer?",options:["Madinah","Jerusalem","Makkah","Cairo"],a:2},
{q:"What is the holy book of Islam called?",options:["Torah","Bible","Qur'an","Vedas"],a:2}
],
medium:[
{q:"How many Surahs are in the Qur'an?",options:["100","114","120","99"],a:1},
{q:"Who was the first Caliph after Prophet Muhammad ﷺ?",options:["Umar ibn al-Khattab","Abu Bakr as-Siddiq","Uthman ibn Affan","Ali ibn Abi Talib"],a:1},
{q:"What percentage of wealth is typically given as Zakat?",options:["1%","2.5%","5%","10%"],a:1},
{q:"Which angel is known for delivering revelation to the Prophets?",options:["Mikail","Israfil","Jibril","Malik"],a:2},
{q:"What is the night of Laylat al-Qadr associated with?",options:["The birth of the Prophet ﷺ","The revelation of the Qur'an","The Hijrah","The Battle of Badr"],a:1},
{q:"Which Surah is known as the 'Heart of the Qur'an'?",options:["Ya-Sin","Al-Kahf","Al-Mulk","Ar-Rahman"],a:0},
{q:"What is the Arabic term for the pilgrimage to Makkah?",options:["Umrah","Hajj","Ziyarah","Safar"],a:1}
],
hard:[
{q:"What was the name of the cave where Prophet Muhammad ﷺ received the first revelation?",options:["Cave of Thawr","Cave of Hira","Cave of Uhud","Cave of Badr"],a:1},
{q:"Who compiled the Qur'an into a single mus'haf during Uthman's caliphate?",options:["A committee led by Zayd ibn Thabit","Abu Bakr alone","Umar ibn al-Khattab alone","Ali ibn Abi Talib alone"],a:0},
{q:"Which battle is referred to as 'Al-Furqan' (The Criterion) in the Qur'an?",options:["Battle of Uhud","Battle of Badr","Battle of the Trench","Battle of Hunayn"],a:1},
{q:"What is the term for consensus of Islamic scholars used in jurisprudence?",options:["Qiyas","Ijma","Istihsan","Urf"],a:1},
{q:"In which year of the Hijrah did the Treaty of Hudaybiyyah take place?",options:["4 AH","6 AH","8 AH","10 AH"],a:1},
{q:"Which of the four rightly-guided Caliphs ruled for the shortest period?",options:["Abu Bakr","Umar","Uthman","Ali"],a:0}
]
};

if (typeof module !== "undefined") module.exports = {DUAS,QUOTES,VERSE_OF_DAY,LIBRARY_BOOKS,NEWS,QUIZ_QUESTIONS};
