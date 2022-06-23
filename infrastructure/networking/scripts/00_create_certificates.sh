git clone https://github.com/OpenVPN/easy-rsa.git /tmp/easy-rsa

/tmp/easy-rsa/easyrsa3/easyrsa init-pki
/tmp/easy-rsa/easyrsa3/easyrsa build-ca nopass
/tmp/easy-rsa/easyrsa3/easyrsa build-server-full server nopass
/tmp/easy-rsa/easyrsa3/easyrsa build-client-full client1.domain.tld nopass

mkdir vpn_certificates
cp pki/ca.crt vpn_certificates/
cp pki/issued/server.crt vpn_certificates/
cp pki/private/server.key vpn_certificates/
cp pki/issued/client1.domain.tld.crt vpn_certificates
cp pki/private/client1.domain.tld.key vpn_certificates/
