@isTest
global class MockResponsePass implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest request){
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"attributes":{"type":"Opportunity","url":"/services/data/v51.0/sobjects/Opportunity/0065g0000070By0AAE"},"Name":"Edge Emergency Generator","AccountId":"0015g00000A21SjAAJ","StageName":"Id. Decision Makers","Type":"Existing Customer - Replacement","Amount":35000.00,"Id":"0065g0000070By0AAE"}');
        response.setStatusCode(200);
        return response; 
    }
}