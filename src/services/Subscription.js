import Subscriber from './Subscriber';

export default function Subscription() {
    this.list = [];
    this.subscribe = this.subscribe.bind(this);
    this.update = this.update.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
}
Subscription.prototype.subscribe = function(stateSetter) {
    this.list.push(new Subscriber(stateSetter));
}
Subscription.prototype.unsubscribe = function(stateSetter) {
    this.list = this.list.filter(sub => sub.stateSetter !== stateSetter);
}
Subscription.prototype.update = function(data) {
    this.list.forEach(sub => sub.update(data));
}