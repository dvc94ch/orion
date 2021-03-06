ReactiveTemplates.onRendered('accounts.index', function() {
  this.subscribe('adminAccountsList');
})

ReactiveTemplates.helpers('accounts.index', {
  users: function () {
    return Meteor.users.find({}, { sort: { createdAt: -1 } });
  },
  buttons: function() {
    var self = this;
    return _.filter(orion.accounts._adminUsersButtons, function(value, key, list){
      if (typeof value.shouldShow != 'function') {
        return true;
      }
      return value.shouldShow(self);
    });
  }
});

ReactiveTemplates.events('accounts.index', {
  'click .user-btn-action': function (event, template) {
    var button = this;
    var userId = $(event.currentTarget).attr('data-user');
    var user = Meteor.users.findOne(userId);
    if (button.meteorMethod) {
      Meteor.call(button.meteorMethod, user);
    } else if (button.route) {
      Router.go(button.route, user);
    }
  }
});

ReactiveTemplates.onRendered('accounts.update.roles', function() {
  var userId = Router.current().params._id;
  this.subscribe('adminAccountsUpdateRoles', userId);
})

ReactiveTemplates.helpers('accounts.update.roles', {
  user: function() {
    var userId = Router.current().params._id;
    return Meteor.users.findOne(userId);
  },
  roles: function() {
    return _.keys(Roles._roles);
  },
  hasRole: function() {
    var userId = Router.current().params._id;
    var role = String(this);
    return Roles.userHasRole(userId, role);
  }
});

ReactiveTemplates.events('accounts.update.roles', {
  'submit form.roles': function (event, template) {
    var userId = Router.current().params._id;
    var roles = [];
    template.$('input[role]').each(function(index, val) {
       var role = $(this).attr('role');
       if ($(this).is(':checked')) {
        roles.push(role);
       }
    });
    Meteor.call('updateRoles', userId, roles, function (error, result) {
      if (error) {
        alert(error.reason) 
      } else {
        Router.go('accounts.index');
      }
    });
    return false;
  }
});