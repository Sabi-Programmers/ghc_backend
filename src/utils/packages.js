const getTotalPackageOrderedPrice = (packages, prices) => {
    let total = 0;
    Object.entries(packages).forEach(([pkg, unit]) => {
        const price = prices[pkg.toLowerCase()];
        if (price !== undefined) {
            total += price * unit;
            total = Number(total.toFixed(2));
        }
    });

    return total;
};

export { getTotalPackageOrderedPrice };
