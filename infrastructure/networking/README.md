## Networking

The networking application configures a VPC and Hosted DNS zone for each stage.

If you want to skip creating a new VPC for a specific stage (e.g. `qa`), set
the `USE_VPC=stage-with-vpc` in `.env.qa` 

This application sets up subdomain delegation. Configure the delegated nameservers in [subdomains.json](subdomains.json)
```json
{
  "subdomain": [
    "ns-xxxx.awsdns-yy.co.uk",
    "ns-xxxx.awsdns-yy.net",
    "ns-xxxx.awsdns-yy.com",
    "ns-xxxx.awsdns-yy.org"
  ]
}
```