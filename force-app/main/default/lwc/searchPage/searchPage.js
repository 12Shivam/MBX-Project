import { LightningElement, track, wire } from 'lwc';
import getOpps from '@salesforce/apex/SearchPageController.getOpportunities';
import sendOpp from '@salesforce/apex/SearchPageController.sendOpportunites';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
  {label: 'Opportunity Name', fieldName: 'oppUrl', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}, sortable: true},
  {label: 'Account Name', fieldName: 'accUrl', type: 'url', typeAttributes: {label: { fieldName: 'AccountName__c' }, target: '_blank'}, sortable: true},
  {label: 'Stage', fieldName: 'StageName', type: 'text', sortable: true},
  {label: 'Type', fieldName: 'Type', type: 'text', sortable: true},
  {label: 'Amount', fieldName: 'Amount', type: 'currency', sortable: true},
  {label: 'Send Opportunity', type: 'button', cellAttributes:{alignment:'center'}, typeAttributes:{
    label: 'Send',
    name: 'Send Opportunity',
    title: 'Send Opportunity',
    disabled: false,
    value: 'send',
    variant: 'Success'
  }}
]

export default class SearchPage extends LightningElement {
  oppList; // store all records returned from apex controller
  visibleRecords; // store limited records for pagination purpose
  
  @track recordsFound = false; // show/hide datatable template
  @track columns = COLUMNS; // column data for data-table

  async searchValues(event){
    try{
      if(event.keyCode === 13 && event.target.value){
        const result = await getOpps({searchKey: event.target.value})
        if(result && result.length > 0){
          let oppUrl, accUrl;
          this.oppList = result.map(row => {
            oppUrl = `/${row.Id}`;
            accUrl = `/${row.AccountId}`;
            return {...row, oppUrl, accUrl};
          })
          // show the datatable template
          this.recordsFound = true; 
        }else{
          // hide previous search result
          this.recordsFound = false;  
          // display msg 'No records found'
          const evt = new ShowToastEvent({
            title: 'Search Result',
            message: 'No Records Found!',
            variant: 'error'
          });
          this.dispatchEvent(evt);
        }
      }
    }catch(er){console.log(er);}
  }

  updateRec(event){
    this.visibleRecords = [...event.detail.records];
  }

  // Manage Http callouts on buttonClick
  async callRowAction(event){
    try{
      const recordId = event.detail.row.Id;
      console.log(recordId);
      if(event.detail.action.name === 'Send Opportunity'){
        // Get the status code back
        const resCode = await sendOpp({i: recordId});
        console.log(resCode);
        if(resCode && resCode == 200){
          this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'Record sent succesfully',
            variant: 'success' 
          }));
        }
      }
    }catch(er){
      console.log(er);
      // Http request failed
      // show an error mesage
      this.dispatchEvent(new ShowToastEvent({
        title: 'Failure!',
        message: er.body.message,
        variant: 'error'
      }));
    }
  }
}