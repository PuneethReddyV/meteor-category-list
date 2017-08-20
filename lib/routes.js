import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('index');
  }
});

FlowRouter.route('/info', {
  name: 'info',
  action() {
    BlazeLayout.render('information');
  }
});

FlowRouter.route('/NodeEdit/:_id', {
  name: 'edit.node',
  action() {
    BlazeLayout.render('editNode');
  }
});

FlowRouter.route('/NodeAdd/:_id', {
  name: 'edit.add',
  action() {
    BlazeLayout.render('addNode');
  }
});