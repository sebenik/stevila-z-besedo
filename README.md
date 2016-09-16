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
converter.convert(data);
```

###options
- **type**: (**"number"**, "date", "digit"). Izberi tip pretvornika.
- **decimalniSimbolPika**: poljuben parameter (true, **false**). V Sloveniji za decimalno ločilo uporabljamo decimalno vejico ',' (privzeto). Če želite z besedo zapisati števila, ki za decimalni simbol uporabljajo decimalno piko '.', parametru pripišite vrednost true.
- **brezPresledkov**: poljuben parameter (true, **false**). Z besedo zapisana števila upoševajo pravila slovenskega knjižnjega jezika, ki med drugim narekujejo tudi, kako ločujemo zapisana števila s presledki. Če želite števila zapisati brez presledkov, parametru pripišite vrednost true.

###data
Število/datum oz. vektor(array) števil/datumov, ki jih želimo zapisati z besedo.

##Primer

``` Javascript
var szb = require("stevila-z-besedo");
var numberConverter = new szb({
  "type": "number",
  "decimalniSimbolPika": true
});
var stevila = [1, -1000, 2.12e7, 0.31];
var zBesedo = converter.convert(data);

console.log(zBesedo);
// [ 'ena',
//   'minus tisoč',
//   'enaindvajset milijonov dvesto tisoč',
//   'nič cela enaintrideset stotink'
// ]
```
