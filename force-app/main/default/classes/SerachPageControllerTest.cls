@isTest
private class SerachPageControllerTest {
    @isTest static void testgetOpportunities(){
        List<Opportunity> opportunites = new List<Opportunity>();
        for(Integer count=1; count<=50; count++){
            opportunites.add(new Opportunity(
                Name='Opportunity'+count, 
                CloseDate = System.today() + 10,
                StageName = 'Prospecting',
                Type = 'New Customer',
                Amount = 50000,
                AccountId = '0015g00000A6sYZAAZ',
                Integration_Status__c = 'Success'       
            ));
        }
        insert opportunites;
        
        Test.startTest();
        List<Opportunity> result = SearchPageController.getOpportunities('Opportunity');
        Test.stopTest();
        // verify that we found some records
        System.assert(!result.isEmpty());
        // verify that Opportunity with name - Opportunity1 is present
        System.assertEquals(result[0].Name, 'Opportunity1');
    }


    @isTest static void testsendOpportunitesPassed(){
        // Create an opportunity
        Opportunity op = new Opportunity(
            Name='Opportunity101',
            CloseDate=System.today() + 10,
            StageName='Prospecting',
            Type='New Customer',
            Integration_Status__c = 'Success'
        );
        // insert it
        insert op;
        // get the id of that opportunity
        Opportunity opp = [SELECT Id from Opportunity where Name='Opportunity101'];
        String id = opp.Id;
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new MockResponsePass());
        Integer resCode = SearchPageController.sendOpportunites(id);
        Test.stopTest();

        System.assertEquals(200, resCode);
    }

    @isTest static void testsendOpportunitesFailed(){
        Opportunity op = new Opportunity(
            Name='Opportunity101',
            CloseDate=System.today() + 10,
            StageName='Prospecting',
            Type='New Customer',
            Integration_Status__c = 'Success'
        );

        insert op;

        Opportunity opp = [SELECT Id from Opportunity where Name='Opportunity101'];
        String id = opp.Id;
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new MockResponseFail());
        Integer resCode = SearchPageController.sendOpportunites(id);
        Test.stopTest();

        System.assertNotEquals(200, resCode);
    }
}
