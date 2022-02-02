const express = require('express');
const app = express();
 const alerts = require("./static/alerts.json")

app.get('/', (req, res) => {
  res
    .status(200)
    .send('<h1>Welcome to Alerts API 😀</h1> <p>put the endpoint for easy use</p> \
    <li> /alerts </li>\
    <li> /agents</li>\
    <li> /agents/id</li>\
    <p>For this first 3 items you need to put a offset and limit values like this: url?offset=numbre&limit=numbrer</p>\
    <li>/rules</li>\
    <li>/rules/id</li>')
    .end();
});

app.get('/alerts', (req, res) => {
    const q = req.query;
    const responseJson = {
        total_items: 0,
        data: [],
    };
    //Ask for offset and limit an validate if offset not is greater than limit
    if (q.offset && q.limit) {
        if (q.limit > q.offset) {
            responseJson.total_items = (alerts.slice(q.offset, q.limit)).length;
            //Slice the array from alerts.json to make it fit in the offset and limit values
            (alerts.slice(q.offset, q.limit)).forEach(element => {
                responseJson.data.push(element);
            });
            res.status(200).type('json').json(responseJson);
        } else {
            return '<h1>Sorry, we cannot search for an offset value greater than the limit.</h1>';
        }
    } else {
        res.status(400).type('json').json(responseJson);
    };
} );
app.get('/agents', (req, res) => {
    const q = req.query;
    const responseJson = {
        total_items: 0,
        data: []
    };
          //Ask for offset and limit an validate if offset not is greater than limit
          if (q.offset && q.limit) {
            if (q.limit > q.offset) {
                //Slice the array from alerts.json to make it fit in the offset and limit values and clean the array only left agents
                let agents = alerts.slice(q.offset, q.limit);
                responseJson.total_items = agents.length;

                agents.forEach(element => {
                    //verify if the agent isnt in the array and add a new agent else at the same agent +1
                    if (responseJson.data.find(((x => x.id === element._source.agent.id)))) {
                        var finded = responseJson.data.find((x => x.id === element._source.agent.id));
                        finded.total_alerts = finded.total_alerts + 1;
                    } else {
                        var newagent = {
                            id: "",
                            name: "",
                            ip: "",
                            total_alerts: 0
                        };
                        newagent.id = element._source.agent.id;
                        newagent.name = element._source.agent.name;
                        newagent.ip = element._source.agent.ip;
                        newagent.total_alerts = 1;
                        responseJson.data.push(newagent);
                    };
                });
                res.status(200).type('json').json(responseJson);
            } else {
                res.status(400).type('json').json(responseJson);
            };
        } else {
            res.status(400).type('json').json(responseJson);
        }
    } );
app.get('/agents/:id', (req, res) => {
        let getAlerts = {}
        getAlerts = alerts.find(((x => x._source.agent.id === req.params.id)));
        if (getAlerts) {
            getAlerts = getAlerts._source.agent;
            res.status(200).type('json').json(getAlerts);
        } else {
            return "Error we canot find the id required"
        }
    } );

app.get('/rules', (req, res) => {
    const q = req.query;
    const responseJson = {
        total_items: 0,
        data: [],
    };
    //Ask for offset and limit an validate if offset not is greater than limit
    if (q.offset && q.limit) {
        if (q.limit > q.offset) {
            responseJson.total_items = (alerts.slice(q.offset, q.limit)).length;
            //Slice the array from alerts.json to make it fit in the offset and limit values
            (alerts.slice(q.offset, q.limit)).forEach(element => {
                //verify if the agent isnt in the array and add a new agent else at the same agent +1
                if (responseJson.data.find(((x => x.rule.id === element._source.rule.id)))) {
                    var finded = responseJson.data.find((x => x.rule.id === element._source.rule.id));
                    finded.total_alerts = finded.total_alerts + 1;
                } else {
                    var newRule = {
                        rule: {},
                        total_alerts: 0
                    };
                    newRule.rule = element._source.rule;
                    newRule.total_alerts = 1;
                    responseJson.data.push(newRule);
                };
            });
            res.status(200).type('json').json(responseJson);
        } else {
            res.status(400).type('json').json(responseJson);
        }
    } else {
        res.status(400).type('json').json(responseJson);
    };
} );

app.get('/rules/:id', (req, res) => {
    var flag = false;
    const responseJson = {
        rule: {},
        total_alerts: 0,
        alerts: [],
    };
    //Ask for offset and limit an validate if offset not is greater than limit
        if (req.params.id) {
            //Slice the array from alerts.json to make it fit in the offset and limit values
            alerts.forEach(element => {
                //I check if this alert has this rule and add it. 
                if (element._source.rule.id===req.params.id) {
                    if(!flag){
                        responseJson.rule = element._source.rule;
                        flag=true;
                    }
                    responseJson.total_alerts = responseJson.total_alerts+1;
                    responseJson.alerts.push(element);
                };
            });
            res.status(200).type('json').json(responseJson);
        } else {
            res.status(400).type('json').json(responseJson);
        }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Port:   ${PORT}`);
});