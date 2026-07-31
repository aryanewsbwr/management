import { Publisher, Publication, Region, Hawker, Customer, CustomerDetail, PublicationRate, Holiday, Bill, Receipt, CounterSale, Purchase, Collector, ReceiptIssue, PublicationSup } from './types';

export const mockPublishers: Publisher[] = [
  {
    "publisher_id": 1,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  },
  {
    "publisher_id": 2,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Dealer"
  },
  {
    "publisher_id": 3,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Publisher"
  },
  {
    "publisher_id": 4,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Magzine",
    "type": "Dealer"
  },
  {
    "publisher_id": 5,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Dealer"
  },
  {
    "publisher_id": 6,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Publisher"
  },
  {
    "publisher_id": 7,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Magzine",
    "type": "Dealer"
  },
  {
    "publisher_id": 8,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  },
  {
    "publisher_id": 9,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Magzine",
    "type": "Publisher"
  },
  {
    "publisher_id": 10,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Publisher"
  },
  {
    "publisher_id": 11,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Magzine",
    "type": "Publisher"
  },
  {
    "publisher_id": 12,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  },
  {
    "publisher_id": 13,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Publisher"
  },
  {
    "publisher_id": 14,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Magzine",
    "type": "Publisher"
  },
  {
    "publisher_id": 15,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  },
  {
    "publisher_id": 16,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  },
  {
    "publisher_id": 17,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Both",
    "type": "Publisher"
  },
  {
    "publisher_id": 18,
    "name": "Publisher",
    "address": "",
    "city": "",
    "state": "",
    "pincode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "website": "",
    "category": "Newspaper",
    "type": "Publisher"
  }
];

export const mockPublications: Publication[] = [
  {
    "publication_id": 1,
    "public_name": "THE TIMES OF INDIA",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 1,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 2,
    "public_name": "HINDUSTAN TIMES",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 6,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 5,
    "public_name": "RAJASTHAN PATRIKA",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 2,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 4,
    "public_name": "DAINIK BHASKAR",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 3,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 6,
    "public_name": "ZINDIA TODAY HINDI",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 7,
    "public_name": "EMPLOYMENT NEWS ",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 8,
    "public_name": "ROJGAR SAMACHAR",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 9,
    "public_name": "ZINDIA TODAY ENGLISH",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 10,
    "public_name": "MERI SAHELI",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 11,
    "public_name": "GRIHASHOBHA",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 12,
    "public_name": "The Economic Times",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 1,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 13,
    "public_name": "Vanita",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 14,
    "public_name": "Wisdom",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 15,
    "public_name": "Magic Pot",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 16,
    "public_name": "Aha Zindgi",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 17,
    "public_name": "Sarita ",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 18,
    "public_name": "Saras Salil",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 19,
    "public_name": "Punjab Kesari",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 8,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 20,
    "public_name": "Nafa Nuksan",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 5,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 21,
    "public_name": "Dainik Navajyoti",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 5,
    "publisher_name": "Publisher",
    "type_p": "Daily",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "Morning",
    "is_active": true
  },
  {
    "publication_id": 22,
    "public_name": "Pratiyogita Darpan",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 23,
    "public_name": "champak",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 24,
    "public_name": "champak(h)",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 89,
    "public_name": "Inside Outside",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 26,
    "public_name": "LOTPOT",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 27,
    "public_name": "OUTLOOK(E)",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 28,
    "public_name": "Outlook(H)",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 29,
    "public_name": "Vyapar",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 9,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 30,
    "public_name": "Business World",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 31,
    "public_name": "Balhans",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 2,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 32,
    "public_name": "Rojgar Sandesh",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 5,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 33,
    "public_name": "BalBhaskar",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 3,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 34,
    "public_name": "ChotuMotu",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 2,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 35,
    "public_name": "Dalal Street (H)",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 36,
    "public_name": "Femina",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 11,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 37,
    "public_name": "Capital Market",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 38,
    "public_name": "Womens Era",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 39,
    "public_name": "Business Today",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 40,
    "public_name": "Grihalaxmi",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 41,
    "public_name": "Vigyan Pragati",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 42,
    "public_name": "Suman Saurabh",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 43,
    "public_name": "Nandan",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 44,
    "public_name": "Yojna",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 45,
    "public_name": "Mukta",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 46,
    "public_name": "Kurushetra",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 47,
    "public_name": "Awishkar",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 7,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 48,
    "public_name": "Full Tansion",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 49,
    "public_name": "Current GK Chronology",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 50,
    "public_name": "Manohar Khaniyan",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  },
  {
    "publication_id": 51,
    "public_name": "Kadambini",
    "pub_name_hindi": "",
    "abrevation": "",
    "publisher_id": 4,
    "publisher_name": "Publisher",
    "type_p": "Magazine",
    "rate": 5.0,
    "duration": "",
    "publishing_day": "Daily",
    "circulation": "",
    "is_active": true
  }
];

export const mockRegions: Region[] = [
  {
    "region_id": 1,
    "region_name": "ZAMBUJA"
  },
  {
    "region_id": 3,
    "region_name": "Z4"
  },
  {
    "region_id": 4,
    "region_name": "ZShree Cement"
  },
  {
    "region_id": 5,
    "region_name": "ZMasuda Road"
  },
  {
    "region_id": 6,
    "region_name": "ZDungri Road"
  },
  {
    "region_id": 7,
    "region_name": "ZPaliBazar"
  },
  {
    "region_id": 8,
    "region_name": "ZAjmer Road"
  },
  {
    "region_id": 9,
    "region_name": "Z2 I"
  },
  {
    "region_id": 10,
    "region_name": "Z2 II"
  },
  {
    "region_id": 11,
    "region_name": "2 III"
  },
  {
    "region_id": 12,
    "region_name": "Z3I"
  },
  {
    "region_id": 13,
    "region_name": "Z3II"
  },
  {
    "region_id": 14,
    "region_name": "Z3III"
  },
  {
    "region_id": 15,
    "region_name": "ZDukan"
  },
  {
    "region_id": 16,
    "region_name": "ZBalad Road"
  },
  {
    "region_id": 17,
    "region_name": "ZNakad"
  },
  {
    "region_id": 18,
    "region_name": "ZDinesh N P C A"
  },
  {
    "region_id": 19,
    "region_name": "ZGirdhari Mittal"
  },
  {
    "region_id": 20,
    "region_name": "ZGhanshyam Choti"
  },
  {
    "region_id": 21,
    "region_name": "ZSCLRas"
  },
  {
    "region_id": 22,
    "region_name": "ZLacchu"
  },
  {
    "region_id": 23,
    "region_name": "ZRavipratap"
  },
  {
    "region_id": 24,
    "region_name": "ZAvnish Jain Jawaja"
  },
  {
    "region_id": 25,
    "region_name": "ZSatat Shiksha Kendra"
  },
  {
    "region_id": 26,
    "region_name": "ZRamesh Goyal"
  },
  {
    "region_id": 27,
    "region_name": "ZFaruque"
  },
  {
    "region_id": 28,
    "region_name": "ZMadhav Mittal"
  },
  {
    "region_id": 29,
    "region_name": "ZSunil Mittal"
  },
  {
    "region_id": 30,
    "region_name": "ZDurgesh"
  },
  {
    "region_id": 31,
    "region_name": "ZKhandelwal "
  },
  {
    "region_id": 32,
    "region_name": "Dairy"
  },
  {
    "region_id": 33,
    "region_name": "Nagar"
  },
  {
    "region_id": 34,
    "region_name": "Temp"
  },
  {
    "region_id": 35,
    "region_name": "ZShreeOffice"
  },
  {
    "region_id": 36,
    "region_name": "Z"
  },
  {
    "region_id": 37,
    "region_name": "ZRaju Courier"
  },
  {
    "region_id": 38,
    "region_name": "1"
  },
  {
    "region_id": 39,
    "region_name": "ZAshokDawai"
  },
  {
    "region_id": 40,
    "region_name": "ZHarish L"
  },
  {
    "region_id": 41,
    "region_name": "ZRaju Dawai"
  },
  {
    "region_id": 42,
    "region_name": "Zbasant"
  },
  {
    "region_id": 43,
    "region_name": "ZShyam News"
  },
  {
    "region_id": 44,
    "region_name": "ZOLD DUES"
  },
  {
    "region_id": 45,
    "region_name": "ZShankarji"
  },
  {
    "region_id": 46,
    "region_name": "ZGuptaNews"
  },
  {
    "region_id": 47,
    "region_name": "ZHarish"
  },
  {
    "region_id": 48,
    "region_name": "ZSantosh News"
  },
  {
    "region_id": 49,
    "region_name": "ZNirantar"
  },
  {
    "region_id": 50,
    "region_name": "ZLaduji"
  },
  {
    "region_id": 51,
    "region_name": "ZParashar"
  },
  {
    "region_id": 52,
    "region_name": "ZNewTemp"
  },
  {
    "region_id": 53,
    "region_name": "ZSantosh"
  },
  {
    "region_id": 54,
    "region_name": "ZRajuGoyalWala"
  },
  {
    "region_id": 55,
    "region_name": "ZARoad"
  },
  {
    "region_id": 56,
    "region_name": "ZChunnilal"
  },
  {
    "region_id": 57,
    "region_name": "ZBedDebts"
  },
  {
    "region_id": 58,
    "region_name": "ZMRSurvey"
  },
  {
    "region_id": 59,
    "region_name": "MasudaRoadII"
  },
  {
    "region_id": 60,
    "region_name": "MasudaraodI"
  },
  {
    "region_id": 61,
    "region_name": "ZSCL MandirSamahroh"
  },
  {
    "region_id": 62,
    "region_name": "NandNagar"
  },
  {
    "region_id": 63,
    "region_name": "ZFatehpuriy"
  },
  {
    "region_id": 64,
    "region_name": "ZSCL"
  },
  {
    "region_id": 65,
    "region_name": "ZBRM"
  },
  {
    "region_id": 66,
    "region_name": "SendraRoad"
  },
  {
    "region_id": 67,
    "region_name": "ZAdarshnagar"
  },
  {
    "region_id": 68,
    "region_name": "ZGayatrinagar"
  },
  {
    "region_id": 69,
    "region_name": "ZBhajannagar"
  },
  {
    "region_id": 70,
    "region_name": "ZRicco"
  },
  {
    "region_id": 71,
    "region_name": "MunnaBhai"
  },
  {
    "region_id": 72,
    "region_name": "ZUmeshGoyal"
  },
  {
    "region_id": 73,
    "region_name": "ZAroadByPass"
  },
  {
    "region_id": 74,
    "region_name": "ZKishanganj"
  },
  {
    "region_id": 75,
    "region_name": "Dungarifatak"
  },
  {
    "region_id": 76,
    "region_name": "Pratapnagar"
  },
  {
    "region_id": 77,
    "region_name": "ZGuptaji"
  },
  {
    "region_id": 78,
    "region_name": "ZNakadShree"
  },
  {
    "region_id": 79,
    "region_name": "Court"
  },
  {
    "region_id": 80,
    "region_name": "ZFiroz"
  },
  {
    "region_id": 81,
    "region_name": "Z1Palibazar"
  },
  {
    "region_id": 82,
    "region_name": "ZOSMewarigate"
  },
  {
    "region_id": 83,
    "region_name": "GPR"
  },
  {
    "region_id": 84,
    "region_name": "3"
  },
  {
    "region_id": 85,
    "region_name": "MG3II"
  },
  {
    "region_id": 86,
    "region_name": "ZGoyalNews"
  },
  {
    "region_id": 87,
    "region_name": "3IMB"
  },
  {
    "region_id": 88,
    "region_name": "ZSCLBagatpura"
  },
  {
    "region_id": 89,
    "region_name": "SR2"
  },
  {
    "region_id": 90,
    "region_name": "Z2"
  },
  {
    "region_id": 91,
    "region_name": "CRd"
  },
  {
    "region_id": 92,
    "region_name": "Ngate"
  },
  {
    "region_id": 93,
    "region_name": "ZDRoad"
  },
  {
    "region_id": 94,
    "region_name": "HB"
  },
  {
    "region_id": 95,
    "region_name": "ZRGPR"
  },
  {
    "region_id": 96,
    "region_name": "ZRCMN"
  },
  {
    "region_id": 97,
    "region_name": "ZRCMN2"
  },
  {
    "region_id": 98,
    "region_name": "ZMDR"
  },
  {
    "region_id": 99,
    "region_name": "5Delwararoad"
  },
  {
    "region_id": 100,
    "region_name": "5AN"
  },
  {
    "region_id": 101,
    "region_name": "5RHB"
  },
  {
    "region_id": 102,
    "region_name": "Z5Bypass"
  },
  {
    "region_id": 103,
    "region_name": "5Dayanagar"
  },
  {
    "region_id": 104,
    "region_name": "5Gnagar"
  },
  {
    "region_id": 105,
    "region_name": "Z4Dr"
  },
  {
    "region_id": 106,
    "region_name": "ZSub Agent"
  },
  {
    "region_id": 107,
    "region_name": "SRoad"
  },
  {
    "region_id": 108,
    "region_name": "Z1Nnagar"
  },
  {
    "region_id": 109,
    "region_name": "4C"
  },
  {
    "region_id": 110,
    "region_name": "SCL"
  },
  {
    "region_id": 111,
    "region_name": "ZOSMewarigate2"
  },
  {
    "region_id": 112,
    "region_name": "SCLOffice"
  },
  {
    "region_id": 113,
    "region_name": "Z3PC"
  },
  {
    "region_id": 114,
    "region_name": "ZSclRasOffice"
  },
  {
    "region_id": 115,
    "region_name": "ZDB"
  },
  {
    "region_id": 116,
    "region_name": "1D"
  },
  {
    "region_id": 117,
    "region_name": "UG"
  },
  {
    "region_id": 118,
    "region_name": "Ag"
  },
  {
    "region_id": 119,
    "region_name": "GMR"
  },
  {
    "region_id": 120,
    "region_name": "Whatsapp"
  },
  {
    "region_id": 121,
    "region_name": "Df"
  }
];

export const mockHawkers: Hawker[] = [
  {
    "hawker_id": 1,
    "name": "Hawker 1",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      1
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 2,
    "name": "Hawker 2",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      1
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 3,
    "name": "Hawker 3",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      3
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 4,
    "name": "Hawker 4",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      3
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 5,
    "name": "Hawker 5",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      3
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 6,
    "name": "Hawker 6",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      4
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 7,
    "name": "Hawker 7",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      4
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 8,
    "name": "Hawker 8",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      3
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 9,
    "name": "Hawker 9",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      4
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 10,
    "name": "Hawker 10",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      5
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 11,
    "name": "Hawker 11",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      6
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 12,
    "name": "Hawker 12",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      5
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 13,
    "name": "Hawker 13",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      7
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 14,
    "name": "Hawker 14",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      7
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 15,
    "name": "Hawker 15",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 16,
    "name": "Hawker 16",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 17,
    "name": "Hawker 17",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 18,
    "name": "Hawker 18",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 19,
    "name": "Hawker 19",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 20,
    "name": "Hawker 20",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 21,
    "name": "Hawker 21",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 22,
    "name": "Hawker 22",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 23,
    "name": "Hawker 23",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 39,
    "name": "Hawker 39",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      3
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 38,
    "name": "Hawker 38",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      7
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 26,
    "name": "Hawker 26",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      5
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 27,
    "name": "Hawker 27",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      6
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 28,
    "name": "Hawker 28",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      7
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 40,
    "name": "Hawker 40",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      7
    ],
    "region_name": "Assigned Routes"
  },
  {
    "hawker_id": 41,
    "name": "Hawker 41",
    "address": "",
    "city": "",
    "phone": "",
    "mobile": "",
    "assigned_regions": [
      8
    ],
    "region_name": "Assigned Routes"
  }
];

export const mockCustomers: Customer[] = [
  {
    "customer_id": 1,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 455,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 2,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 456,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 3,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 599,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 4,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 387,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 5,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 656,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 6,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 565,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 7,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 407,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 8,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 433,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 9,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 680,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 10,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 10,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 11,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 529,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 12,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 710,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 13,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 436,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 14,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 50.0,
    "priority": 611,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 15,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 50.0,
    "priority": 600,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 16,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 711,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 17,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 414,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 18,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 533,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 19,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 49,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 20,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 57,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 21,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 537,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 22,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 413,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 23,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 391,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 24,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 37,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 486,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 50.0,
    "priority": 683,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 26,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 488,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 27,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 712,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 28,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 422,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 29,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 713,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 30,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 395,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 31,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 352,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 32,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 242,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 34,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 647,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 35,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 319,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 36,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 553,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 37,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "94130 79793",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 77,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 38,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 305,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 39,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 51,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 40,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 50.0,
    "priority": 715,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 41,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "maOsa",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 588,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 42,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 75,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 44,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 50.0,
    "priority": 716,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 45,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 718,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 487,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 700,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 47,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "GaovarjaI",
    "phone": "",
    "security_deposit": 20.0,
    "priority": 543,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 49,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 521,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 489,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 719,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 51,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 443,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 52,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 664,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  },
  {
    "customer_id": 53,
    "name_eng": "Customer",
    "name_hindi": "",
    "cust_type": "Regular",
    "add1": "",
    "add2": "",
    "hindi_add": "",
    "phone": "",
    "security_deposit": 0.0,
    "priority": 328,
    "due_amount": 0.0,
    "c_bal": 0.0,
    "region_id": 1,
    "region_name": "Zone",
    "paid_status": "Paid",
    "govt_supply": false,
    "is_sub_agent": false,
    "susha_05": true,
    "is_self": true
  }
];

export const mockCustomerDetails: CustomerDetail[] = [
  { sno: 1, customer_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_id: 1, hawker_name: 'Ramesh Kumar', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2026-01-01', discount_percent: 0, discount: 0, delivery_charge: 30.00, hw_sa: 'Hawker' },
  { sno: 2, customer_id: 2, publication_id: 2, publication_name: 'Dainik Jagran', hawker_id: 2, hawker_name: 'Suresh Sharma', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2026-01-01', discount_percent: 0, discount: 0, delivery_charge: 30.00, hw_sa: 'Hawker' }
];

export const mockPublicationRates: PublicationRate[] = [
  { rate_id: 1, publication_id: 1, day_of_week: 1, rate: 5.00 },
  { rate_id: 2, publication_id: 1, day_of_week: 2, rate: 5.00 },
  { rate_id: 3, publication_id: 1, day_of_week: 3, rate: 5.00 },
  { rate_id: 4, publication_id: 1, day_of_week: 4, rate: 5.00 },
  { rate_id: 5, publication_id: 1, day_of_week: 5, rate: 5.00 },
  { rate_id: 6, publication_id: 1, day_of_week: 6, rate: 5.00 },
  { rate_id: 7, publication_id: 1, day_of_week: 7, rate: 7.00 }
];

export const mockHolidays: Holiday[] = [
  { holiday_id: 1, oc_date: '2026-08-15', occasion: 'Independence Day Press Holiday', affected_publications: [1, 2, 3] }
];

export const mockBills: Bill[] = [
  { bill_id: 101, customer_id: 1, customer_name: 'Sharma Ji', name_hindi: 'शर्मा जी', bill_month: 'July', bill_year: 2026, paper_amount: 320.00, delivery_amount: 30.00, discount_amount: 0.00, previous_due: 110.00, total_amount: 460.00, net_payable: 460.00, status: 'Unpaid', generated_date: '2026-07-31', total_copies: 31 }
];

export const mockReceipts: Receipt[] = [
  { receipt_id: 101, receipt_no: 'REC-1187540', customer_id: 1, customer_name: 'Sharma Ji', collect_id: 1, collector_name: 'Vijay Kumar', receipt_date: '2026-07-30', bill_amount: 460.00, manual_rcp_amt: 0.00, receipt_amount: 460.00, less_amount: 0.00, balance_amount: 0.00, manual_rcp_no: '1187540', manual_rcp_date: '2026-07-30', payment_mode: 'Cash', remarks: 'Monthly Subscription Paid' }
];

export const mockCounterSales: CounterSale[] = [
  { sale_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 2, rate: 5.00, amt: 10.00, sale_date: '2026-07-31', period: '2026-2027', customer_name: 'Walk-in Retail', narration: 'OTC Cash Sale' }
];

export const mockPurchases: Purchase[] = [
  { purchase_id: 1, publisher_id: 1, publisher_name: 'Dainik Bhaskar Press', bill_no: 'INV-DB-9001', bill_date: '2026-07-28', r_date: '2026-07-29', total: 420.00, add_less: 0.00, net_amt: 420.00, items: [{ publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 100, rate: 4.20, amt: 420.00 }] }
];

export const mockCollectors: Collector[] = [
  { collect_id: 1, name: 'Vijay Kumar', address: 'Central Zone Office', phone: '9826012345' }
];

export const mockReceiptIssues: ReceiptIssue[] = [
  { issue_id: 1, collect_id: 1, collector_name: 'Vijay Kumar', receipt_from: 1187500, receipt_to: 1187600, issue_date: '2026-07-01' }
];

export const mockPublicationSups: PublicationSup[] = [
  { publica_id: 1, publication_name: 'Dainik Bhaskar', supname: 'Rasrang Weekend Supplement' }
];
