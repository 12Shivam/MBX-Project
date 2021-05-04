public with sharing class OppTableController {
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
}
