import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
export async function GET() {
  const prisma = new PrismaClient().$extends({
    result: {
      clients: {
        expires_left: {
          needs: {expired_at: true},
          compute(user) {
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const dated = new Date(user.expired_at)
            const minus = dated.getTime() - new Date().getTime()
            const result = Math.round(minus / day)
            return `${result} Day${result == 1 ? '': 's'}`
          },
        }
      }
    }
  })
  const getClient = await prisma.clients.findMany({
    include: {
      admin: {
        select: {
          username: true,
          pin: true,
        },
      },
    },
  });

  await prisma.$disconnect();

  //   if (!getClient) return false;
  return Response.json(getClient);
}

export async function POST(req: Request) {
  const { client_name, super_admin_id, service_days } = await req.json();
  const prisma = new PrismaClient();
  const string_client_name: string = client_name;
  const client_code_first: any[] = string_client_name.trim().toString().split(' ');
  let client_code_final: any = '';
  let super_admin: string;
  let firstLetterBackup: any[];
  client_code_first.forEach((data: string) => {
    const firstLetter: any[] = data.split('');
    client_code_final += firstLetter[0];
  });
  // +firstLetter[Math.abs(Math.round(Math.random() * (firstLetter.length - 1)))];
  const clients = await prisma.clients.findFirst({
    where: {
      client_name: client_name,
    },
    select: {
      client_name: true,
      client_code: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  if (clients)
    return Response.json(
      {
        message: 'Client already exists',
      },
      { status: 409 }
    );

  const checkClients: any[] = await prisma.$queryRaw`SELECT 
    client_name,
    client_code
   FROM clients WHERE client_code REGEXP ${client_code_final + '[0-9]+|' + client_code_final} 
   ORDER BY client_code DESC LIMIT 1`;

  if (checkClients.length !== 0) {
    const clients_code_final_ova: string = checkClients[0].client_code.replace(/[a-zA-Z]/g, '');
    client_code_final += Number(clients_code_final_ova) + 1;
  }

  let session: any;
  super_admin = super_admin_id;
  if (!super_admin_id) {
    session = await getServerSession(authOptions);
    super_admin = session?.user.id;
  }
  const admin_username = string_client_name.replace(/\s+/g, '').toLocaleLowerCase();
  const license_key = randomUUID() + Math.abs(Math.floor(Math.random() * 10101010));
  const service_days_number: number = service_days;
  const expired_at = new Date();
  expired_at.setDate(expired_at.getDate() + Number(service_days_number));
  const hashedPin = await bcrypt.hash('12345678', 10);
  const createClient = await prisma.clients.create({
    data: {
      license_key: license_key,
      client_name: client_name,
      client_code: client_code_final.toLocaleUpperCase(),
      super_admin_id: super_admin,
      expired_at: expired_at,
      admin: {
        create: {
          pin: hashedPin,
          name: 'Admin ' + client_name,
          username: admin_username,
          setting: {
            create: {
              emp_can_login: true,
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();

  if (!createClient) return false;

  return Response.json({
    success: true,
    message: 'Client successfully added',
  });
}