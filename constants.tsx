import { DaySchedule } from './types';
import React from 'react';

// Icons for Transport
export const Icons = {
  Car: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Walk: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Train: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  Plane: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
};

export const ITINERARY_DATA: DaySchedule[] = [
  {
    date: '2026-03-11',
    displayDate: '3/11',
    dayOfWeek: '週三',
    title: '抵達沖繩・國際通散步',
    weatherLocations: [
      { locationName: '那霸市', lat: 26.2124, lon: 127.6809, forecasts: [] }
    ],
    events: [
      {
        id: '1-1',
        time: '18:20',
        title: 'TPE 桃園起飛',
        type: 'transport',
        description: 'Peach MM930 (第一航廈)。請提前 2.5 小時抵達機場。',
        bookingCode: 'CF4WH7',
        transportMode: 'flight',
        location: '桃園國際機場'
      },
      {
        id: '1-2',
        time: '20:50',
        title: '抵達那霸機場 (OKA)',
        type: 'transport',
        description: '入境後前往國內線航廈搭乘單軌電車。',
        location: '那霸機場',
        locationUrl: 'https://maps.google.com/?q=Naha+Airport'
      },
      {
        id: '1-3',
        time: '21:30',
        title: '單軌前往飯店',
        type: 'transport',
        description: '那霸空港站 → 旭橋站。約14分鐘。飯店步行約10分鐘。',
        transportMode: 'monorail',
        monorailInfo: '那霸空港站 (首站) -> 旭橋站 (第5站)',
        monorailUrl: 'https://www.yui-rail.co.jp/tc/routemap/nahakuko/?t=timetable',
        location: 'THE NEST NAHA',
        locationUrl: 'https://maps.app.goo.gl/DWL7M94ADFaZUc1q6',
        tips: ['單軌末班車約 23:30，時間充裕。', '可以使用西瓜卡 (Suica) 或直接買票。']
      },
      {
        id: '1-4',
        time: '22:30',
        title: '國際通覓食',
        type: 'food',
        location: '國際通',
        locationUrl: 'https://maps.google.com/?q=Kokusai-dori',
        description: '沿著縣廳前方向走，找一間居酒屋或拉麵簡單吃。',
        transportMode: 'walk',
        mustEat: ['暖暮拉麵 (如果人不多)', '沖繩麵', 'Orion 生啤酒'],
        mustBuy: ['便利商店炸雞 (當宵夜)', 'Lawson 甜點'],
        tips: ['順便認路，看藥妝店在哪。']
      }
    ]
  },
  {
    date: '2026-03-12',
    displayDate: '3/12',
    dayOfWeek: '週四',
    title: '自駕・萬座毛・美國村',
    weatherLocations: [
      { locationName: '萬座毛', lat: 26.5049, lon: 127.8502, forecasts: [] },
      { locationName: '美國村', lat: 26.3167, lon: 127.7573, forecasts: [] }
    ],
    events: [
      {
        id: '2-1',
        time: '08:20',
        title: '前往租車行',
        type: 'transport',
        location: 'ORIX 旭橋站西口營業所',
        locationUrl: 'https://maps.google.com/?q=ORIX+Rent-a-car+Asahibashi',
        description: '步行約 10 分鐘。先走到旭橋站/巴士總站，再走到營業所。',
        transportMode: 'walk',
        tips: ['請準備：台灣駕照、日文譯本、護照。']
      },
      {
        id: '2-2',
        time: '09:00',
        title: '自駕前往萬座毛',
        type: 'transport',
        description: '沿國道58號往北，約 70km，60-90分鐘。',
        transportMode: 'drive',
        mapCode: '206 312 039*17', 
        locationUrl: 'https://maps.google.com/?q=Manzamo',
        duration: '90 min'
      },
      {
        id: '2-3',
        time: '10:30',
        title: '萬座毛 (Manzamo)',
        type: 'sightseeing',
        location: '萬座毛',
        locationUrl: 'https://maps.google.com/?q=Manzamo',
        description: '標誌性的象鼻岩，感受海風與壯闊海景。',
        tips: ['這裡風很大，拍照要注意頭髮。', '步道走一圈約 20-30 分鐘。'],
        mustEat: ['販賣部的沖繩特產點心']
      },
      {
        id: '2-4',
        time: '12:00',
        title: '前往北谷美國村',
        type: 'transport',
        description: '走國道58號往南回北谷，約 30-35km。',
        transportMode: 'drive',
        mapCode: '33 526 450*63',
        locationUrl: 'https://maps.google.com/?q=American+Village+Okinawa',
        duration: '50 min'
      },
      {
        id: '2-5',
        time: '13:00',
        title: '美國村 (American Village)',
        type: 'activity',
        location: '北谷美國村',
        locationUrl: 'https://maps.google.com/?q=American+Village+Okinawa',
        description: '逛街、看海、咖啡店。充滿美式風情。',
        mustEat: ['Taco Rice (塔可飯)', 'Blue Seal 冰淇淋', 'Poork Tamago Onigiri (飯糰)'],
        mustBuy: ['美式古著', '特色貼紙'],
        tips: ['可以一路待到晚上看摩天輪夜景。', '晚餐建議找海景餐廳或居酒屋。']
      },
      {
        id: '2-6',
        time: '20:00',
        title: 'Live House & 回那霸',
        type: 'activity',
        description: '享受沖繩音樂之夜後，開車回那霸飯店。',
        transportMode: 'drive',
        locationUrl: 'https://maps.app.goo.gl/DWL7M94ADFaZUc1q6',
        duration: '40 min'
      }
    ]
  },
  {
    date: '2026-03-13',
    displayDate: '3/13',
    dayOfWeek: '週五',
    title: '那霸市區・首里城・玉泉洞',
    weatherLocations: [
      { locationName: '首里城', lat: 26.2170, lon: 127.7195, forecasts: [] },
      { locationName: '玉泉洞', lat: 26.1396, lon: 127.7472, forecasts: [] }
    ],
    events: [
      {
        id: '3-1',
        time: '09:00',
        title: '波上宮 or 市區散步',
        type: 'sightseeing',
        location: '波上宮',
        locationUrl: 'https://maps.google.com/?q=Naminoue+Shrine',
        description: '懸崖上的神社，如果有時間可以去看看，或者在國際通吃早餐。',
        tips: ['可以買「交通安全」御守。'],
        transportMode: 'walk'
      },
      {
        id: '3-2',
        time: '10:30',
        title: '前往首里城',
        type: 'transport',
        description: '自駕約 4-7km，視塞車情況約 20 分鐘。',
        transportMode: 'drive',
        locationUrl: 'https://maps.google.com/?q=Shuri+Castle',
        mapCode: '33 161 526*66'
      },
      {
        id: '3-3',
        time: '11:00',
        title: '首里城公園',
        type: 'sightseeing',
        location: '首里城',
        locationUrl: 'https://maps.google.com/?q=Shuri+Castle',
        description: '琉球王國的象徵。參觀復原中的城堡與城牆景觀。',
        mustEat: ['首里城附近的琉球料理', '傳統茶點'],
        tips: ['主要區域在整修，但見學復原過程也很難得。', '有些斜坡，建議穿好走的鞋。']
      },
      {
        id: '3-4',
        time: '13:00',
        title: '前往玉泉洞 (Okinawa World)',
        type: 'transport',
        description: '走國道或快速道路，約 13-15km。',
        transportMode: 'drive',
        mapCode: '232 495 330*83',
        locationUrl: 'https://maps.google.com/?q=Okinawa+World',
        duration: '40 min'
      },
      {
        id: '3-5',
        time: '13:40',
        title: '玉泉洞 + 王國村',
        type: 'sightseeing',
        location: '沖繩世界文化王國',
        locationUrl: 'https://maps.google.com/?q=Okinawa+World',
        description: '日本第二大鐘乳石洞「玉泉洞」，非常壯觀。',
        tips: ['洞內濕氣重，地板濕滑請小心。', '走完洞窟可以逛傳統工藝村。'],
        mustEat: ['王國村內的自助餐', '芒果冰沙']
      },
      {
        id: '3-6',
        time: '16:00',
        title: '返回那霸',
        type: 'transport',
        description: '開車回飯店休息或放車。',
        transportMode: 'drive',
        locationUrl: 'https://maps.app.goo.gl/DWL7M94ADFaZUc1q6',
        duration: '40 min'
      },
      {
        id: '3-7',
        time: '18:00',
        title: '居酒屋小酌・泡湯',
        type: 'food',
        description: '前往國際通小巷食堂或居酒屋。飯後回飯店大浴場泡湯。',
        mustEat: ['阿古豬火鍋', '炒苦瓜', '海葡萄', '泡盛酒'],
        locationUrl: 'https://maps.google.com/?q=Kokusai-dori',
        tips: ['如果想要更在地氛圍，可以去榮町市場附近。', '注意飯店大浴場最晚入場時間。']
      }
    ]
  },
  {
    date: '2026-03-14',
    displayDate: '3/14',
    dayOfWeek: '週六',
    title: '漫遊・還車・返台',
    weatherLocations: [
      { locationName: '那霸市', lat: 26.2124, lon: 127.6809, forecasts: [] },
      { locationName: '台灣桃園', lat: 25.0797, lon: 121.2342, forecasts: [] }
    ],
    events: [
      {
        id: '4-1',
        time: '11:00',
        title: '退房・寄放行李',
        type: 'stay',
        description: '把行李寄放在 THE NEST NAHA。',
        location: 'THE NEST NAHA',
        locationUrl: 'https://maps.app.goo.gl/DWL7M94ADFaZUc1q6'
      },
      {
        id: '4-2',
        time: '11:30',
        title: '國際通最後衝刺',
        type: 'shopping',
        location: '國際通 / 牧志市場',
        locationUrl: 'https://maps.google.com/?q=Makishi+Public+Market',
        description: '慢慢吃、買伴手禮。推薦去牧志公設市場晃晃。',
        mustEat: ['牧志市場海鮮', '豬肉蛋飯糰'],
        mustBuy: ['紅芋塔', '黑糖', '辣油', '金楚糕', '雪鹽'],
        transportMode: 'walk'
      },
      {
        id: '4-3',
        time: '15:30',
        title: '整理行李・前往還車',
        type: 'transport',
        description: '回飯店拿行李，整理戰利品。16:30 前往 ORIX 旭橋站西口還車。',
        transportMode: 'drive',
        mapCode: '33 126 724*14',
        locationUrl: 'https://maps.google.com/?q=ORIX+Rent-a-car+Asahibashi',
        tips: ['還車前記得加滿油 (保留收據)。', '檢查車上有無遺漏物品。']
      },
      {
        id: '4-4',
        time: '17:00',
        title: '單軌前往機場',
        type: 'transport',
        description: '旭橋站 → 那霸機場。建議 18:30 左右抵達機場。',
        transportMode: 'monorail',
        locationUrl: 'https://maps.google.com/?q=Naha+Airport',
        monorailInfo: '旭橋站 -> 那霸空港站',
        monorailUrl: 'https://www.yui-rail.co.jp/tc/routemap/asahibashi/',
      },
      {
        id: '4-5',
        time: '21:30',
        title: 'OKA 那霸起飛',
        type: 'transport',
        description: 'Tigerair IT233。',
        bookingCode: 'T4QJUV',
        transportMode: 'flight',
        location: '那霸機場',
        locationUrl: 'https://maps.google.com/?q=Naha+Airport'
      },
      {
        id: '4-6',
        time: '22:05',
        title: '抵達桃園 (TPE)',
        type: 'transport',
        description: '平安回家！'
      }
    ]
  }
];