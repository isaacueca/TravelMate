TravelMate sources 2010-11-16

------------------------------------------------
    Copyright (C) 2010-2011 Mike Hardaker for Jag.gr.
 
    This file is part of TravelMate.

    TravelMate is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TravelMate is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with TravelMate.  If not, see <http://www.gnu.org/licenses/>.
------------------------------------------------


The Sencha Touch files (sencha_touch.js and sencha_touch.css), the latest versions of which can be downloaded from http://www.sencha.com/, are not included.

Nor is access provided to the API used for delivering the ECB currency data: you'll need to write your own.

That data can be sourced at:

* http://www.ecb.int/stats/eurofxref/eurofxref-daily.xml

It must be parsed on the server to deliver a JSON-P response (where "callbackName" is the name of the callback used) as follows, with the first key:value pair being the "date" and the date in "dayname DD monthname YYYY" and all susequent key:value pairs being the ISO 4217 currency symbol followed by the current ECB rate (note that EUR will always be 1, and needs to be added manually to the ECB data):

callbackName(
      { "results" : [ { "key" : "date",
        "value" : "Tuesday 16 November 2010"
      },
      { "key" : "EUR",
        "value" : "1"
      },
      { "key" : "USD",
        "value" : "1.3612"
      },
      { "key" : "JPY",
        "value" : "113.21"
      },
      { "key" : "BGN",
        "value" : "1.9558"
      },
      { "key" : "CZK",
        "value" : "24.607"
      },
      { "key" : "DKK",
        "value" : "7.4547"
      },
      { "key" : "EEK",
        "value" : "15.6466"
      },
      { "key" : "GBP",
        "value" : "0.85100"
      },
      { "key" : "HUF",
        "value" : "276.95"
      },
      { "key" : "LTL",
        "value" : "3.4528"
      },
      { "key" : "LVL",
        "value" : "0.7092"
      },
      { "key" : "PLN",
        "value" : "3.9372"
      },
      { "key" : "RON",
        "value" : "4.2925"
      },
      { "key" : "SEK",
        "value" : "9.3753"
      },
      { "key" : "CHF",
        "value" : "1.3408"
      },
      { "key" : "NOK",
        "value" : "8.1670"
      },
      { "key" : "HRK",
        "value" : "7.3941"
      },
      { "key" : "RUB",
        "value" : "42.3215"
      },
      { "key" : "TRY",
        "value" : "1.9801"
      },
      { "key" : "AUD",
        "value" : "1.3874"
      },
      { "key" : "BRL",
        "value" : "2.3504"
      },
      { "key" : "CAD",
        "value" : "1.3817"
      },
      { "key" : "CNY",
        "value" : "9.0355"
      },
      { "key" : "HKD",
        "value" : "10.5546"
      },
      { "key" : "IDR",
        "value" : "12197.34"
      },
      { "key" : "INR",
        "value" : "61.6800"
      },
      { "key" : "KRW",
        "value" : "1539.11"
      },
      { "key" : "MXN",
        "value" : "16.7370"
      },
      { "key" : "MYR",
        "value" : "4.2612"
      },
      { "key" : "NZD",
        "value" : "1.7655"
      },
      { "key" : "PHP",
        "value" : "59.566"
      },
      { "key" : "SGD",
        "value" : "1.7682"
      },
      { "key" : "THB",
        "value" : "40.652"
      },
      { "key" : "ZAR",
        "value" : "9.5426"
      }
    ] }
);