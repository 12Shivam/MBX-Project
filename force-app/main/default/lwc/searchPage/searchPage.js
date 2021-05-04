import { LightningElement, track, wire } from 'lwc';
import getOpps from '@salesforce/apex/OppTableController.getOpportunities';
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
  }

  updateRec(event){
    console.log(event.detail.records);
    this.visibleRecords = [...event.detail.records];
  }
}