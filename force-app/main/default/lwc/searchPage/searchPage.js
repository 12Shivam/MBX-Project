// https://vkambham.blogspot.com/2020/02/lwc-paginator.html
import { LightningElement, track } from 'lwc';
import getOpportunities from '@salesforce/apex/SearchPageController.getOpportunities';
export default class SearchPage extends LightningElement {
  searchKey='';
  @track opportunities;
  @track error;

  @track columns = [
    {label: 'Opportunity Name', fieldName: 'oppUrl', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}, sortable: true},
    {label: 'Account Name', fieldName: 'accUrl', type: 'url', typeAttributes: {label: { fieldName: 'AccountName__c' }, target: '_blank'}, sortable: true},
    {label: 'Stage', fieldName: 'StageName', type: 'text', sortable: true},
    {label: 'Type', fieldName: 'Type', type: 'text', sortable: true},
    {label: 'Amount', fieldName: 'Amount', type: 'currency', sortable: true}
  ]

  handleKeyChange(event){
    this.searchKey = event.target.value;
  }

  async handleSearch(event){
    try{
      // check if key was enter
      if(event.keyCode === 13){
        const result = await getOpportunities({key: this.searchKey})
        if(result){
          let oppUrl, accUrl;
          this.opportunities = result.map(row => {
            oppUrl = `/${row.Id}`;
            accUrl = `/${row.AccountId}`;
            return {...row, oppUrl, accUrl};
          })
        }
      }
    }catch(er){this.error = error;}
  }
}