public with sharing class SearchPageController {
    // Method to fetch record from datamodel
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String searchKey){
        try {
            String key = '%'+searchKey+'%';
            return [SELECT Id, Name, StageName, Type, Amount, AccountId, AccountName__c FROM Opportunity WHERE
                Name Like :key OR
                StageName Like :key OR
                Type Like :key OR
                AccountName__c Like :key
                WITH SECURITY_ENFORCED
                ORDER BY Name
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Method to send http callout
    @AuraEnabled
    public static Integer sendOpportunites(String i){
        try {
            // fetch opportunity record from the id provided
            Opportunity opp = [SELECT Name, AccountId, StageName, Type, Amount from Opportunity where Id=:i];
            // convert the opp to JSON 
            String resBody = JSON.serialize(opp);

            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://project4.free.beeceptor.com/mbx');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            // Set the body as JSON object
            request.setBody(resBody);
            HttpResponse response = http.send(request);
            
            if(response.getStatusCode() == 200){
                opp.Integration_Status__c = 'Success';
                opp.Integration_Comments__c = 'Success';
                update opp;
            }else{
                opp.Integration_Status__c = 'Failure';
                opp.Integration_Comments__c = response.getStatus();
                update opp;
            }
            return response.getStatusCode();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
