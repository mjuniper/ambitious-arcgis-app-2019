import Service from '@ember/service';

export default Service.extend({

  search(q) {
    return {
      "query": q,
      "total": 1408,
      "start": 1,
      "num": 10,
      "nextStart": 11,
      "results": [{
        "id": "27467c140c9b4aea90b9b327a22f1675",
        "owner": "EsriMedia",
        "created": 1389830710000,
        "modified": 1389917598000,
        "type": "Web Map",
        "title": "Beer Spending"
      }, {
        "id": "927b9b1acbed4e9592c79a2d876c6c5c",
        "owner": "EsriMedia",
        "created": 1391208130000,
        "modified": 1391226848000,
        "type": "Map Service",
        "title": "Super_Bowl_Beer"
      }, {
        "id": "07a5810edbb847858e82b7c0fd1623a7",
        "owner": "3918",
        "created": 1378993854000,
        "modified": 1408632978000,
        "type": "Feature Service",
        "title": "Brewers_of_Ohio"
      }, {
        "id": "d710e7f6304e4bfabdd325acaea67687",
        "owner": "Paul2573",
        "created": 1317183218000,
        "modified": 1340642545000,
        "type": "Web Map",
        "title": "Great American Beer Festival Exhibitors & Regions"
      }, {
        "id": "de56d53d741440158c8a2ab053c6474c",
        "owner": "EsriMedia",
        "created": 1391208131000,
        "modified": 1391226131000,
        "type": "Feature Service",
        "title": "Super_Bowl_Beer"
      }, {
        "id": "4c1d7d082b53404cafa9183ecc6c4520",
        "owner": "EsriMedia",
        "created": 1474903833000,
        "modified": 1479133217000,
        "type": "Web Mapping Application",
        "title": "Tampa Bay Beer Drinking Habits"
      }, {
        "id": "9ffb804c63184c73892080f171e40c69",
        "owner": "complot",
        "created": 1459695423000,
        "modified": 1488111152000,
        "type": "Web Map",
        "title": "beer_sheva2"
      }, {
        "id": "9a2e589d0db441429d23c10b7b26982d",
        "owner": "dclancy4",
        "created": 1360687160000,
        "modified": 1360705495000,
        "type": "Web Mapping Application",
        "title": "NJ Breweries & Beer Events"
      }, {
        "id": "1dec28199f19404c8c551155736e05e0",
        "owner": "vladivoj",
        "created": 1376945919000,
        "modified": 1377038441000,
        "type": "Web Map",
        "title": "My beer map"
      }, {
        "id": "7c54f5a614e9441092930b0beca5eef6",
        "owner": "joethebeekeeper",
        "created": 1372739018000,
        "modified": 1405720465000,
        "type": "Web Map",
        "title": "Redding Beer Week"
      }]
    };
  }

});
