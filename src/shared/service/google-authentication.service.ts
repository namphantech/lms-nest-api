import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { TokenInfo } from 'google-auth-library';

@Injectable()
export class GoogleAuthenticationService {
  private oauthClient: Auth.OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    const clientID = this.configService.get('google.id');
    const clientSecret = this.configService.get('google.secret');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }
  async verifyGGToken(tokenFromGoogle: string): Promise<TokenInfo | false> {
    try {
      const tokenPayload = await this.oauthClient.getTokenInfo(tokenFromGoogle);
      if (tokenPayload.email && tokenPayload) {
        return tokenPayload;
      }
    } catch (e) {
      console.log('VERIFY TOKEN ERROR', e);
      return false;
    }
  }
}
