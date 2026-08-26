import { DnsRecord, RegistrarGuideItem } from '../types';

export const GITHUB_A_RECORDS: DnsRecord[] = [
  {
    type: 'A',
    host: '@ (or leave blank / root)',
    value: '185.199.108.153',
    ttl: '3600 (1 Hour) / Automatic',
    purpose: 'GitHub Pages Anycast Load Balancer Node 1',
    recommended: true,
  },
  {
    type: 'A',
    host: '@ (or leave blank / root)',
    value: '185.199.109.153',
    ttl: '3600 (1 Hour) / Automatic',
    purpose: 'GitHub Pages Anycast Load Balancer Node 2',
    recommended: true,
  },
  {
    type: 'A',
    host: '@ (or leave blank / root)',
    value: '185.199.110.153',
    ttl: '3600 (1 Hour) / Automatic',
    purpose: 'GitHub Pages Anycast Load Balancer Node 3',
    recommended: true,
  },
  {
    type: 'A',
    host: '@ (or leave blank / root)',
    value: '185.199.111.153',
    ttl: '3600 (1 Hour) / Automatic',
    purpose: 'GitHub Pages Anycast Load Balancer Node 4',
    recommended: true,
  },
];

export const GITHUB_CNAME_RECORDS: DnsRecord[] = [
  {
    type: 'CNAME',
    host: 'www',
    value: 'sriinfra2025-ops.github.io.',
    ttl: '3600 (1 Hour) / Automatic',
    purpose: 'Redirects www.sriinfradevlopers.in to GitHub Pages repository',
    recommended: true,
  },
];

export const GITHUB_AAAA_RECORDS: DnsRecord[] = [
  {
    type: 'AAAA',
    host: '@',
    value: '2606:50c0:8000::153',
    ttl: '3600',
    purpose: 'IPv6 GitHub Pages Node 1 (Optional but recommended)',
  },
  {
    type: 'AAAA',
    host: '@',
    value: '2606:50c0:8001::153',
    ttl: '3600',
    purpose: 'IPv6 GitHub Pages Node 2 (Optional but recommended)',
  },
  {
    type: 'AAAA',
    host: '@',
    value: '2606:50c0:8002::153',
    ttl: '3600',
    purpose: 'IPv6 GitHub Pages Node 3 (Optional but recommended)',
  },
  {
    type: 'AAAA',
    host: '@',
    value: '2606:50c0:8003::153',
    ttl: '3600',
    purpose: 'IPv6 GitHub Pages Node 4 (Optional but recommended)',
  },
];

export const REGISTRAR_GUIDES: RegistrarGuideItem[] = [
  {
    id: 'godaddy',
    name: 'GoDaddy',
    logoIcon: 'Globe',
    popularIn: 'Widely used in India',
    notes: 'GoDaddy requires adding 4 separate A records under the @ host. Ensure you delete any Parked A-record pointing to 34.102.136.180 or similar.',
    instructions: [
      {
        stepNumber: 1,
        title: 'Sign in & Go to My Products',
        description: 'Log into godaddy.com, open "My Products" and locate sriinfradevlopers.in. Click "DNS" or "Manage DNS".',
      },
      {
        stepNumber: 2,
        title: 'Delete Existing Default / Parked A-Records',
        description: 'If you see an existing A Record with Name "@" pointing to a GoDaddy parking IP (like 34.x.x.x or Parked), click the pencil icon and delete it.',
        actionTip: 'Important: Keeping the old A-record will cause GitHub InvalidDNSError!',
      },
      {
        stepNumber: 3,
        title: 'Add the 4 GitHub A-Records',
        description: 'Click "Add New Record". Choose Type "A", Name "@", Value "185.199.108.153", TTL "1 Hour" (or Default). Repeat for 185.199.109.153, 185.199.110.153, and 185.199.111.153.',
      },
      {
        stepNumber: 4,
        title: 'Add CNAME Record for WWW',
        description: 'Add a new record: Type "CNAME", Name "www", Value "sriinfra2025-ops.github.io", TTL "1 Hour". Click Save.',
      },
      {
        stepNumber: 5,
        title: 'Wait 5-15 mins & Recheck GitHub Pages',
        description: 'Return to your GitHub Repository > Settings > Pages. Click "Check again" or re-enter "sriinfradevlopers.in" and click Save.',
      },
    ],
  },
  {
    id: 'hostinger',
    name: 'Hostinger',
    logoIcon: 'Server',
    popularIn: 'Very Popular for .in Domains',
    notes: 'In Hostinger hPanel, access Domains -> sriinfradevlopers.in -> DNS / Nameservers -> Manage DNS Records.',
    instructions: [
      {
        stepNumber: 1,
        title: 'Open Hostinger hPanel DNS Manager',
        description: 'Go to hpanel.hostinger.com -> Domains -> sriinfradevlopers.in -> DNS / Nameservers.',
      },
      {
        stepNumber: 2,
        title: 'Delete Default A records',
        description: 'Delete any old A record pointing to Hostinger server IP under the "@" host.',
      },
      {
        stepNumber: 3,
        title: 'Create 4 A Records',
        description: 'Select Type: A, Name: @, Points to: 185.199.108.153, TTL: 300 or 14400. Add the other 3 IPs: 185.199.109.153, 185.199.110.153, 185.199.111.153.',
      },
      {
        stepNumber: 4,
        title: 'Create CNAME for WWW',
        description: 'Select Type: CNAME, Name: www, Points to: sriinfra2025-ops.github.io. (include trailing dot if asked).',
      },
      {
        stepNumber: 5,
        title: 'Save & Verify',
        description: 'Hostinger updates DNS within 5-10 minutes. Click the "Check DNS Live" button above to verify.',
      },
    ],
  },
  {
    id: 'bigrock',
    name: 'BigRock / ResellerClub',
    logoIcon: 'Layers',
    popularIn: 'India Registrar',
    notes: 'In BigRock OrderBox panel, click "DNS Management" -> "Manage DNS".',
    instructions: [
      {
        stepNumber: 1,
        title: 'Access BigRock Control Panel',
        description: 'Log into bigrock.in, click on "sriinfradevlopers.in" and find "DNS Management" in the right sidebar.',
      },
      {
        stepNumber: 2,
        title: 'Ensure BigRock Nameservers are active',
        description: 'Verify nameservers are set to default (e.g. dns1.bigrock.com, dns2.bigrock.com).',
      },
      {
        stepNumber: 3,
        title: 'Add 4 A Records',
        description: 'Click "A Records" -> "Add A Record". Leave Host Name blank (or @), Destination IPv4 Address: 185.199.108.153. Repeat for .109.153, .110.153, and .111.153.',
      },
      {
        stepNumber: 4,
        title: 'Add CNAME Record',
        description: 'Click "CNAME Records" -> "Add CNAME Record". Host Name: "www", Destination: "sriinfra2025-ops.github.io".',
      },
    ],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    logoIcon: 'Cloud',
    popularIn: 'Fastest Global Propagation',
    notes: 'CRITICAL: In Cloudflare, set proxy status to "DNS Only" (Grey Cloud) during GitHub verification so GitHub can issue Let\'s Encrypt SSL certificates!',
    instructions: [
      {
        stepNumber: 1,
        title: 'Navigate to DNS Records',
        description: 'Select sriinfradevlopers.in in your Cloudflare dashboard and click the "DNS" tab.',
      },
      {
        stepNumber: 2,
        title: 'Add 4 A Records with "DNS Only" (Grey Cloud)',
        description: 'Add Type: A, Name: @, IPv4: 185.199.108.153. Click the orange cloud icon to change it to "DNS Only" (Grey Cloud). Repeat for the other 3 IPs.',
        actionTip: 'Orange Cloud (Proxied) blocks GitHub verification until initial SSL is validated!',
      },
      {
        stepNumber: 3,
        title: 'Add CNAME for www (DNS Only)',
        description: 'Add Type: CNAME, Name: www, Target: sriinfra2025-ops.github.io, Proxy status: DNS only.',
      },
    ],
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    logoIcon: 'ShieldCheck',
    popularIn: 'Global',
    notes: 'In Namecheap, select Domain List -> Manage -> Advanced DNS.',
    instructions: [
      {
        stepNumber: 1,
        title: 'Open Advanced DNS',
        description: 'In Namecheap dashboard, click "Manage" next to sriinfradevlopers.in and go to the "Advanced DNS" tab.',
      },
      {
        stepNumber: 2,
        title: 'Remove Parking URL Redirects',
        description: 'Delete any existing "URL Redirect Record" or "Parking Page A Record".',
      },
      {
        stepNumber: 3,
        title: 'Add 4 A-Records & 1 CNAME',
        description: 'Add 4 A-records for @ pointing to 185.199.108.153 ... 185.199.111.153 and CNAME for www pointing to sriinfra2025-ops.github.io.',
      },
    ],
  },
];

export const TROUBLESHOOTING_CHECKLIST = [
  {
    id: 'cname-file',
    title: '1. CNAME file in repository root',
    description: 'Ensure your GitHub repository has a file named "CNAME" (all uppercase, no extension) in the root of the "main" or "gh-pages" branch containing exact text: sriinfradevlopers.in',
    status: 'important',
  },
  {
    id: 'a-records',
    title: '2. All 4 GitHub A-Records active in Registrar DNS',
    description: 'Ensure 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 are saved under "@".',
    status: 'required',
  },
  {
    id: 'cname-record',
    title: '3. CNAME record for "www" subdomain',
    description: 'Ensure www points to sriinfra2025-ops.github.io so both sriinfradevlopers.in and www.sriinfradevlopers.in work seamlessly.',
    status: 'required',
  },
  {
    id: 'ttl-wait',
    title: '4. DNS Propagation Window',
    description: 'DNS changes take between 5 minutes to 48 hours to propagate across global ISP resolvers. Use our Live DoH checker below to track real-time resolution.',
    status: 'info',
  },
  {
    id: 'enforce-https',
    title: '5. "Enforce HTTPS" Checkbox',
    description: 'Once DNS check turns green, tick "Enforce HTTPS" in GitHub Pages settings. GitHub will auto-provision a free TLS/SSL certificate from Let\'s Encrypt.',
    status: 'success',
  },
];
