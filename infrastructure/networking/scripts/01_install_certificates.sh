echo "Server Certificate"
aws acm import-certificate --certificate fileb://vpn_certificates/server.crt --private-key fileb://vpn_certificates/server.key --certificate-chain fileb://vpn_certificates/ca.crt

echo "Client Certificate"
aws acm import-certificate --certificate fileb://vpn_certificates/client1.domain.tld.crt --private-key fileb://vpn_certificates/client1.domain.tld.key --certificate-chain fileb://vpn_certificates/ca.crt


echo "Download the client VPN configuration"
echo " Insert a section <key></key> from vpn_certificates/client1.domain.tld.key"
echo " Insert a section <cert></cert> from vpn_certificates/client1.domain.tld.crt"

