export default function Subscriber(stateSetter) {
    this.stateSetter = stateSetter;
    this.update = this.update.bind(this);
}
Subscriber.prototype.update = function(data) {
    this.stateSetter(data);
}