let baseUrl = "https://62b06198e460b79df0446b94.mockapi.io/apiSanPham";

function apiGetProducts() {
  return axios({
    url: baseUrl,
    method: "GET",
  });
}
