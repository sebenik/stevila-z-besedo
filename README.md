#Samodejni zapis števil z besedo.
node.js module to convert numbers/dates/digits in to text (Slovene language)

##Zapis

**Celih števil:** 3462543 → 'tri milijone štiristo dvainšestdeset tisoč petsto triinštirideset'

**Decimalnih števil:** 2,108 → 'dve celi sto osem'

**Negativnih števil:** -1000 → 'minus tisoč'

**Znanstvenih števil:** 1,02e2 → 'sto dve'

**Datumov:** 1.4.2000 → 'prvi četrti dva tisoč'

**Cifer:** 46492 → 'štiri šest štiri devet dve'

##Install
```
npm install stevila-z-besedo
```

##Uporaba
```
var szb = require("stevila-z-besedo")
var converter = new szb(options);
var rezultat = converter.convert(data);
```

###options
- **type**: (**"number"**, "date", "digit"). Izberi tip pretvornika.
- **decimalniSimbolPika**: poljuben parameter (true, **false**). V Sloveniji za decimalno ločilo uporabljamo decimalno vejico ',' (privzeto). Če želite z besedo zapisati števila, ki za decimalni simbol uporabljajo decimalno piko '.', parametru pripišite vrednost true.
- **brezPresledkov**: poljuben parameter (true, **false**). Z besedo zapisana števila upoševajo pravila slovenskega knjižnjega jezika, ki med drugim narekujejo tudi, kako ločujemo zapisana števila s presledki. Če želite števila zapisati brez presledkov, parametru pripišite vrednost true.

###data
Število/datum oz. vektor(array) števil/datumov, ki jih želimo zapisati z besedo.
**Veljavne oblike datumov**

| vDD/MM/LLLL | D/M/LLLL | DD/MM/ | D/M/ | DD/ | D/ |
|-------------|----------|--------|------|-----|----|
| DD.MM.LLLL  | D.M.LLLL | DD.MM. | D.M. | DD. | D. |
| DD-MM-LLLL  | D-M-LLLL | DD-MM- | D-M- | DD- | D- |

###rezultat
Vektor(array) besed pretvorjenih števil/datumov v enakem vrstnem redu kot so bili podani.

##Primer

###števila
``` Javascript
var szb = require("stevila-z-besedo");
var numberConverter = new szb({
  "type": "number",
  "decimalniSimbolPika": true
});
var stevila = [1, -1000, 2.12e7, 0.31];
var zBesedo = converter.convert(stevila);

console.log(zBesedo);
// [ 'ena',
//   'minus tisoč',
//   'enaindvajset milijonov dvesto tisoč',
//   'nič cela enaintrideset stotink' ]
```
###datumi
``` Javascript
var szb = require("stevila-z-besedo");
var dateConverter = new szb({
  "type": "date"
});
var datumi = ["1.1.2000", "12/7/", "12.", "03-11-", "31.2."];
var zBesedo = converter.convert(datumi);

console.log(zBesedo);
// [ 'prvi prvi dva tisoč',
//   'dvanajsti sedmi',
//   'dvanajsti',
//   'tretji enajsti',
//   '31.2 is not a valid date form.' ]
```

###cifre
``` Javascript
var szb = require("stevila-z-besedo");
var dateConverter = new szb({
  "type": "digit"
});
var stevila = [12345, "-7,81"];
var zBesedo = converter.convert(stevila);

console.log(zBesedo);
// [ 'ena dve tri štiri pet',
//   'minus sedem celih osem ena' ]
```

