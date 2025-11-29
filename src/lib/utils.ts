export function formatPrice(price: number): string {
    // Manually format to ensure consistency between server and client
    // 1000 -> 1.000
    return "€" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
