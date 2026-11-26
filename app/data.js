// World Bank WDI, extracted 26 November 2026. Raw values; formatting happens in app.js.
export const INDICATORS = [
  { code: "SP.POP.TOTL", name: "Population", value: 386506, year: 2024, unit: "people", group: "People" },
  { code: "SP.POP.GROW", name: "Population growth", value: 0.2183460706, year: 2024, unit: "% a year", group: "People" },
  { code: "SP.DYN.LE00.IN", name: "Life expectancy at birth", value: 82.8097561, year: 2024, unit: "years", group: "People" },
  { code: "SP.DYN.TFRT.IN", name: "Fertility rate", value: 1.56, year: 2024, unit: "births per woman", group: "People" },
  { code: "SP.POP.65UP.TO.ZS", name: "Population aged 65 and over", value: 15.64481546, year: 2024, unit: "% of population", group: "People" },
  { code: "SP.URB.TOTL.IN.ZS", name: "Urban population", value: 94.18190399, year: 2024, unit: "% of population", group: "People" },
  { code: "NY.GDP.MKTP.CD", name: "GDP", value: 33186621855, year: 2024, unit: "US$", group: "Economy" },
  { code: "NY.GDP.PCAP.CD", name: "GDP per capita", value: 85863.14793, year: 2024, unit: "US$", group: "Economy" },
  { code: "NY.GDP.MKTP.KD.ZG", name: "GDP growth", value: -1.282876444, year: 2024, unit: "% a year", group: "Economy" },
  { code: "FP.CPI.TOTL.ZG", name: "Inflation", value: 5.8568385, year: 2024, unit: "% a year", group: "Economy" },
  { code: "SL.UEM.TOTL.ZS", name: "Unemployment", value: 3.6, year: 2024, unit: "% of labour force", group: "Economy" },
  { code: "NE.TRD.GNFS.ZS", name: "Trade openness", value: 86.18157928, year: 2024, unit: "% of GDP", group: "Economy" },
  { code: "EG.ELC.RNEW.ZS", name: "Renewable electricity", value: 99.99363881, year: 2016, unit: "% of electricity", group: "Energy" },
  { code: "EG.FEC.RNEW.ZS", name: "Renewable energy use", value: 82.4, year: 2021, unit: "% of final energy", group: "Energy" },
  { code: "AG.LND.FRST.ZS", name: "Forest cover", value: 0.600218189, year: 2024, unit: "% of land", group: "Environment" },
  { code: "IT.NET.USER.ZS", name: "Internet users", value: 98.209198, year: 2024, unit: "% of population", group: "Society" },
  { code: "SH.XPD.CHEX.GD.ZS", name: "Health spending", value: 8.98358727, year: 2024, unit: "% of GDP", group: "Society" },
  { code: "SE.XPD.TOTL.GD.ZS", name: "Education spending", value: 7.307980061, year: 2022, unit: "% of GDP", group: "Society" },
  { code: "SI.POV.GINI", name: "Gini index", value: 26.8, year: 2019, unit: "index (0 to 100)", group: "Society" },
];

export const SERIES = {
  population: [
    [1960, 175574], [1965, 192286], [1970, 204438], [1975, 217979], [1980, 228138],
    [1985, 241405], [1990, 254826], [1995, 267468], [2000, 281205], [2005, 296734],
    [2010, 318041], [2015, 330815], [2020, 366463], [2024, 386506],
  ],
  gdpPerCapita: [
    [1995, 27564.569102386], [1996, 28583.5208959793], [1997, 28461.7664095122], [1998, 31519.1647473126],
    [1999, 32834.4215745364], [2000, 32503.578963236], [2001, 29208.1981853568], [2002, 32749.379004627],
    [2003, 39944.2104095591], [2004, 47809.6073050042], [2005, 57783.7745608117], [2006, 58172.1426656622],
    [2007, 70483.0117228535], [2008, 57489.3399795216], [2009, 41483.7843682814], [2010, 43776.4677400475],
    [2011, 48254.953927254], [2012, 46594.9869146614], [2013, 50173.3360061057], [2014, 55140.364935793],
    [2015, 53505.6964079339], [2016, 62854.0906407932], [2017, 72976.3729990975], [2018, 75633.8651351915],
    [2019, 69296.3144361601], [2020, 60127.9393575616], [2021, 70425.4064277273], [2022, 76376.9599334915],
    [2023, 82201.2908518078], [2024, 85863.1479330343],
  ],
  lifeExpectancy: [
    [1960, 74.0400731707317], [1970, 73.9339024390244], [1980, 76.8465853658537], [1990, 78.0363414634146],
    [2000, 79.6536585365854], [2010, 81.8975609756097], [2020, 83.0634146341463], [2024, 82.809756097561],
  ],
};
