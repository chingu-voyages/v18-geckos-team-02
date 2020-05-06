import Subscriber from './Subscriber';

export default function Subscription() {
    this.list = [];
    this.subscribe = this.subscribe.bind(this);
    this.update = this.update.bind(this);
}
Subscription.prototype.subscribe = function(stateSetter) {
    const currentIndex = this.list.findIndex(subscriber => subscriber.stateSetter === stateSetter);
    if (currentIndex > 0) {
        this.list.splice(currentIndex, 1);
    }
    else {
        this.list.push(new Subscriber(stateSetter));
    }
}
Subscription.prototype.update = function(data) {
    this.list.forEach(sub => sub.update(data));
}