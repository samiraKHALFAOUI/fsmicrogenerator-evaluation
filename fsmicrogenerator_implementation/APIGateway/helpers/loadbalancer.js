const loadbalancer = {}

loadbalancer.ROUND_ROBIN = (service) => {
    const newIndex = ++service.index >= service.instances.length ? 0 : service.index
    service.index = newIndex
    return loadbalancer.isEnabled(service, newIndex, loadbalancer.ROUND_ROBIN)
}

loadbalancer.LEAST_USED = (service) => {
    // Sort instances by the number of requests they have handled
}

loadbalancer.isEnabled = (service, index, loadBalanceStrategy) => {
    return service.instances[index].status === 'enabled' ? index : loadBalanceStrategy(service)
}

module.exports = loadbalancer